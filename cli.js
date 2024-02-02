#!/usr/bin/env node

import { program, Command } from 'commander';

import { evmGenHandler, evmImportHandler, evmRecoverHandler } from './src/cmd/ethereum.js';
// import { cosmosHandler } from './src/cmd/cosmos.js';

const evmCommand = new Command('evm')
  .description('Ethereum wallet management');

evmCommand
  .command('gen [number]')
  .description('Generate random ethereum wallets')
  .option('-s, --save [string]', 'Save wallet into the dir')
  .option('-l --label <type>', 'Label the wallet')
  .option('-e, --exec <type>', 'export private key for the child process')
  .action(evmGenHandler);

evmCommand
  .command('import')
  .description('Import your ethereum wallet from mnemonic / private key')
  .option('-m, --mnemonic', 'Enter mnemonic interactively')
  .option('-i, --iterate', 'Enter mnemonic one by one')
  .option('-p, --private', 'Enter private key')
  .option('-s, --save [string]', 'Save wallet into the dir')
  .option('-l --label <type>', 'Label the wallet')
  .option('-e, --exec <type>', 'export private key for the child process')
  .action(evmImportHandler);

evmCommand
  .command('recover <filePath>')
  .description('Recover your ethereum wallet from the encrypt keystore file')
  .option('-e, --exec <type>', 'export private key for the child process')
  .action(evmRecoverHandler);

// const cosmCommand = new Command('cosmos')
//   .description('Cosmos wallet management')
//   .option('-c, --chain <type>', 'Cosmos blockchain prefix')
//   .option('-g, --generate [number]', 'Generate cosmos account')
//   .action(cosmosHandler);

const banner = '// | | ._  o     _  ._ _  _. |   \\    / _. | |  _ _|_  _\n// |_| | | | \\/ (/_ | _> (_| |    \\/\\/ (_| | | (/_ |_ _>';

program
  .name('uwallet')
  .description(`${banner}\n\nUniversal Wallet: An universal wallet for multi blockchain player`)
  .version('0.0.1')
  .addCommand(evmCommand);

if (!process.argv.slice(2).length || !process.argv.slice(3).length) program.help();
const cmd = program.parse(process.argv);
if (!cmd.args.length) program.help();
