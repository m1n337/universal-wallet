import { readFileSync } from 'fs';
import { exec } from 'child_process';
import process from 'process';

import inquirer from 'inquirer';

import { EvmWallet } from '../chains/index.js';
import { logger } from '../utils/logger.js';
import { passwordQuestions } from './utils.js';

export const evmHandler = async (options) => {
  const eth = new EvmWallet();

  if (options.recover) {
    const filePath = options.recover;
    const data = readFileSync(filePath);
    const answers = await inquirer.prompt(passwordQuestions);
    const wallet = eth.recoverFromEncryptJson(answers.password, data);
    if (options.exec) {
      const cmd = options.exec;
      process.env.PK = wallet.privateKey;
      exec(cmd, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Failed to exec ${cmd} with error ${error}`);
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
    return;
  }
  const wallets = [];
  if (options.generate) {
    const answers = await inquirer.prompt(passwordQuestions);
    if (options.generate === true) {
      const acc = eth.generateAccount(answers.password);
      wallets.push(acc.wallet);
    } else {
      const accs = eth.batchGenerateAccount(answers.password, options.generate);
      accs.forEach((item) => {
        wallets.push(item.wallet);
      });
    }
  } else if (options.mnemonic) {
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
        } else {
          logger.info('Exiting...');
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
    wallets.push(eth.fromMnemonic(mnemonic));
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
      wallets.push(eth.fromPrivateKey(answers.private));
    } else {
      logger.error('Invalid mnemonic input');
    }
  }
  if (options.save) {
    const dir = options.save;
    const answers = await inquirer.prompt(passwordQuestions);
    if (answers.password) {
      wallets.forEach((item) => {
        eth.saveWallet(item, answers.password, dir);
      });
    } else {
      logger.error('Input empty password');
    }
  }
};
