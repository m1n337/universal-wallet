#!/usr/bin/env node
import { program } from 'commander';

import { evmHandler } from './src/cmd/ethereum.js';

const banner = '// | | ._  o     _  ._ _  _. |   \\    / _. | |  _ _|_  _\n// |_| | | | \\/ (/_ | _> (_| |    \\/\\/ (_| | | (/_ |_ _>';

program
  .name('uwalet')
  .description(`${banner}\n\nUniversal Wallet: An universal wallet for multi blockchain player`)
  .version('0.0.1');

program
    .command('evm')
  .description('Ethereum wallet managemen')
  .option('-g, --generate [number]', 'Generate ethereum account')
  .option('-m, --mnemonic', 'Enter mnemonic interactively')
  .option('-i, --iterate', 'Enter mnemonic one by one')
  .option('-p, --private', 'Enter private key')
  .option('-s, --save <type>', 'Save wallet into the dir')
  .option('-r, --recover <type>', 'Recover the wallet from the encrypt file')
  .action(evmHandler);

if (!process.argv.slice(2).length || !process.argv.slice(3).length) program.help();
const cmd = program.parse(process.argv);
if (!cmd.args.length) program.help();
