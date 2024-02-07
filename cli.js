#!/usr/bin/env node

import { program, Command } from 'commander';

import { evmGenHandler, evmImportHandler, evmRecoverHandler, listWalletHandler } from './src/cmd/ethereum.js';
// import { cosmosHandler } from './src/cmd/cosmos.js';

const addSubCommand = (cmd, subCmdName, desc, action, opts=undefined) => {
  let _opts = [];
  if (opts) {
    _opts = opts.flat();
  }

  let subCmd = cmd.command(subCmdName).description(desc)

  _opts.forEach(opt => {
    subCmd.option(opt.flag, opt.description)
  })

  return subCmd.action(action)
}

const evmCommand = new Command('evm')
  .description('Ethereum wallet management');


const saveOpts = [
  {
    flag: '-s, --save [string]', 
    description: 'Save wallet into the dir'
  },
  {
    flag: '-l --label <type>', 
    description: 'Label the wallet'
  }
]

const execOpts = [
  {
    flag: '-e, --exec <type>',
    description: 'Export private key for the child process'
  }
]


addSubCommand(
  evmCommand, 
  'gen [number]', 
  'Generate random ethereum wallets',
  evmGenHandler,
  [
    saveOpts,
    execOpts,
  ]
);

const importOpts = [
  {
    flag: '-m, --mnemonic',
    description: 'Enter mnemonic interactively'
  },
  {
    flag: '-i, --iterate', 
    description: 'Enter mnemonic one by one'
  },
  {
    flag: '-p, --private', 
    description: 'Enter private key'
  }
]

addSubCommand(
  evmCommand,
  'import',
  'Import your ethereum wallet from mnemonic / private key',
  evmImportHandler,
  [
    importOpts,
    saveOpts,
    execOpts
  ]
)

addSubCommand(
  evmCommand,
  'recover <filePath>',
  'Recover your ethereum wallet from the encrypt keystore file',
  evmRecoverHandler,
  [
    execOpts
  ]
)

const profileOpts = [
  {
    flag: '--keystore [string]', 
    description: 'List all wallets in the keystore dir (Deafult: ~/.uwallet/keystore)'
  },
]

addSubCommand(
  evmCommand,
  'profile',
  'Print the profile of your wallets',
  listWalletHandler,
  [
    profileOpts
  ]
)

const banner = '// | | ._  o     _  ._ _  _. |   \\    / _. | |  _ _|_  _\n// |_| | | | \\/ (/_ | _> (_| |    \\/\\/ (_| | | (/_ |_ _>';

program
  .name('uwallet')
  .description(`${banner}\n\nUniversal Wallet: An universal wallet for multi blockchain player`)
  .version('0.0.1')
  .addCommand(evmCommand);

if (!process.argv.slice(2).length || !process.argv.slice(3).length) program.help();
const cmd = program.parse(process.argv);
if (!cmd.args.length) program.help();
