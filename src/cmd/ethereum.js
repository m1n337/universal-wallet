import { readFileSync } from 'fs';

import inquirer from 'inquirer';
import { EvmWallet } from '../chains/index.js';
import { logger } from '../utils/logger.js';

export const evmHandler = async (options) => {
  const eth = new EvmWallet();
  const passwordQuestions = [
    {
      type: 'password',
      message: 'Enter your password:',
      name: 'password',
      mask: '*',
      validate(value) {
        if (value.length < 6) {
          return 'Password should be at least 6 characters.';
        }
        return true;
      },
    },
    {
      type: 'password',
      name: 'confirmPassword',
      message: 'Confirm your password:',
      mask: '*',
      validate(value, answers) {
        if (value !== answers.password) {
          return 'Passwords do not match.';
        }
        return true;
      },
    },
  ];

  if (options.generate) {
    const answers = await inquirer.prompt(passwordQuestions);
    if (options.generate === true) {
      const acc = eth.generateAccount(answers.password);

      console.log(acc);
      console.log(eth.recoverFromEncryptJson(answers.password, acc.encryptJson));
    } else {
      console.log(eth.batchGenerateAccount(answers.password, options.generate));
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
          console.log('Exiting...');
        }
      } else {
        console.error('ERROR');
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
        console.error('Invalid mnemonic input');
      }
    }
    console.log(mnemonic);
    eth.fromMnemonic(mnemonic);
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
      const wallet = eth.fromPrivateKey(answers.private);
      if (options.save) {
        const dir = options.save;
        console.log(dir);
        const panswers = await inquirer.prompt(passwordQuestions);
        if (panswers.password) {
          eth.saveWallet(wallet, answers.password, dir);
        } else {
          logger.error('Input empty password');
        }
      }
    } else {
      console.error('Invalid mnemonic input');
    }
  } else if (options.recover) {
    const filePath = options.recover;
    const data = readFileSync(filePath);
    const answers = await inquirer.prompt(passwordQuestions);
    eth.recoverFromEncryptJson(answers.password, data);
  }
};
