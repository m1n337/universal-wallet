import { homedir } from 'os';
import { join } from 'path';
import { readFileSync } from 'fs';
import { exec } from 'child_process';
import process from 'process';

import inquirer from 'inquirer';

import { EvmWallet } from '../chains/index.js';
import { logger } from '../utils/logger.js';
import { passwordQuestions } from './utils.js';

const DEFAULT_KEYSTORE = join(homedir(), '.keystore');

const eth = new EvmWallet();

const saveWalletOptionHandler = async (wallets, options) => {
  if (options === undefined) return;
  if (options && options.save) {
    let dir;
    if (options.save === true) {
      dir = DEFAULT_KEYSTORE;
    } else {
      dir = options.save;
    }

    const answers = await inquirer.prompt(passwordQuestions);
    if (answers.password) {
      let labels = [];
      if (options.label) {
        labels = options.label.split(',');
        if (labels.length !== 1 && labels.length !== wallets.length) {
          logger.error('Failed: lables number does not match wallets number');
          return;
        }
      }
      wallets.forEach((item, index) => {
        let label;
        if (labels.length === 0) {
          label = undefined;
        } else if (labels.length === 1) {
          label = options.label;
        } else {
          label = labels[index];
        }

        eth.saveWallet(item, answers.password, dir, label);
      });
    } else {
      logger.error('Input empty password');
    }
  }
};

const execOptionHandler = async (wallets, options) => {
  if (options === undefined) return;
  if (options.exec) {
    const cmd = options.exec;
    if (wallets.length === 1) {
      process.env.PK = wallets[0].privateKey;
    } else {
      wallets.forEach((wallet, index) => {
        process.env[`PK_${index + 1}`] = wallet.privateKey;
      });
    }
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`Failed to exec ${cmd} with error ${error}`);
        return;
      }
      if (stdout) {
        console.log(stdout);
      }
      if (stderr) {
        console.error(stderr);
      }
    });
  }
};

export const evmGenHandler = async (num, options) => {
  const numToGenerate = num || 1;
  const wallets = eth.batchGenerateWallets(numToGenerate);

  await saveWalletOptionHandler(wallets, options);

  await execOptionHandler(wallets, options);
};

export const evmImportHandler = async (options) => {
  let wallet;

  if (options.mnemonic) {
    const mnemonics = [];
    const inputMnemonic = async (num) => {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          message: `Enter your No. ${num} mnemonic:`,
          name: 'mnemonic',
          mask: '*',
        },
      ]);
      if (answers.mnemonic) {
        mnemonics.push(answers.mnemonic);
        if (num < 12) {
          await inputMnemonic(num + 1);
        }
      } else {
        logger.error('ERROR');
      }
    };
    let mnemonic;
    if (options.iterate) {
      await inputMnemonic(1);
      mnemonic = mnemonics.join(' ');
    } else {
      const answers = await inquirer.prompt([
        {
          type: 'password',
          message: 'Enter your mnemonic:',
          name: 'mnemonic',
          mask: '*',
        },
      ]);
      if (answers.mnemonic) {
        mnemonic = answers.mnemonic;
      } else {
        logger.error('Invalid mnemonic input');
      }
    }
    wallet = eth.fromMnemonic(mnemonic);
  } else if (options.private) {
    const answers = await inquirer.prompt([
      {
        type: 'password',
        message: 'Enter your private key:',
        name: 'private',
        mask: '*',
      },
    ]);
    if (answers.private) {
      wallet = eth.fromPrivateKey(answers.private);
    } else {
      logger.error('Invalid mnemonic input');
    }
  }

  await saveWalletOptionHandler([wallet], options);

  await execOptionHandler([wallet], options);
};

export const evmRecoverHandler = async (filePath, options) => {
  const data = readFileSync(filePath);
  const answers = await inquirer.prompt(passwordQuestions);
  const wallet = eth.recoverFromEncryptJson(answers.password, data);

  await execOptionHandler([wallet], options);
};
