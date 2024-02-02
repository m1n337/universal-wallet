import { writeFileSync } from 'fs';

// import { mnemonicToSeed } from 'bip39';
import { ethers } from 'ethers';
// import ethereumjsWallet from 'ethereumjs-wallet';
// import { bufferToHex, pubToAddress } from 'ethereumjs-util';
import { join } from 'path';
import { logger } from '../utils/logger.js';

// const { hdkey } = ethereumjsWallet;

export class EvmWallet {
  constructor() {
    this.provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth');
    this.keyMap = {};
    // this.provider = new InfuraProvider('mainnet', '');
  }

  async fetchENSName(address) {
    try {
      const ensName = await this.provider.lookupAddress(address);

      if (ensName) {
        return ensName;
      }
    } catch (error) {
      logger.error('Failed to fetchENSName: ', error);
    }

    return '';
  }

  //   async getSeed(mnemonic) {
  //     const seed = await mnemonicToSeed(mnemonic);
  //     console.log(`seed: ${bufferToHex(seed)}`);

  //     return seed;
  //   }

  fromPrivateKey(pk) {
    // const wallet = ethers.HDNodeWallet.fromSeed(pk).derivePath(ethers.defaultPath);
    const wallet = new ethers.Wallet(pk, this.provider);
    // logger.info('The wallet is derived from the privarte key: ', wallet.address);
    console.log('- Successfully imported your wallet from the private key:');
    this.print_wallet_info(wallet);

    return wallet;
  }

  fromMnemonic(mnemonic) {
    // let seed = await this.getSeed(mnemonic)
    // let hdWallet = await hdkey.fromMasterSeed(seed)
    // path = m/44'/60'/0'/0/i keypair
    // let key = await hdWallet.derivePath("m/44'/60'/0'/0/0")
    // get private key from the keypair
    // console.log("private key: " + bufferToHex(key.getWallet().getPrivateKey()))
    // get the public key from the keypair
    // console.log("public key: " + bufferToHex(key.getWallet().getPublicKey()))
    // utilize the public key derived from the keypair to generate the address
    // let address = await pubToAddress(key.getWallet().getPublicKey(), true)
    // console.log('account address: ', "0x"+address.toString('hex'))

    const wallet = ethers.Wallet.fromPhrase(mnemonic, this.provider);
    console.log('- Successfully imported your wallet from mnemonic:');
    this.print_wallet_info(wallet);

    return wallet;
  }

  #generateWallet() {
    const wallet = ethers.HDNodeWallet.createRandom();
    console.log('- Successfully generated wallet:');
    this.print_wallet_info(wallet);
    return wallet;
  }

  batchGenerateWallets(num) {
    const wallets = [];
    for (let i = 0; i < num; i++) {
      const wallet = this.#generateWallet();
      wallets.push(wallet);
    }

    return wallets;
  }

  // [Action-1]: Generate num accounts
  // // TODO: need backup old account_table and append new items
  // const accs = batch_generate_accounts(password, num);
  // for(let acc of accs){
  //     writeFileSync(`${keystore_path}/${acc.address}.json`, acc.encryptJson);
  // }
  // writeFileSync(`${keystore_path}/account_table.json`, JSON.stringify(accs.map((item: AccountWithEncrypt): Account => {
  //    return {
  //     address: item.address,
  //     mnemonic: item.mnemonic
  //    };
  // })));

  recoverFromEncryptJson(password, encryptJson) {
    const w = ethers.Wallet.fromEncryptedJsonSync(encryptJson, password);
    const wallet = w.connect(this.provider);
    console.log('- Successful recovered your wallet:');
    this.print_wallet_info(wallet);
    return wallet;
  }

  async saveWallet(wallet, password, dir, name) {
    const encryptJson = wallet.encryptSync(password);
    let ensPrefix = '';
    try {
      ensPrefix = await this.fetchENSName(wallet.address);
    } catch {
      logger.info('Not found ens with address: ', wallet.address);
    }

    let prefix = ensPrefix;
    if (prefix === '' && name) {
      prefix = name;
    }

    if (prefix !== '') {
      prefix = `${prefix}-`;
    }
    const filePath = join(dir, `${prefix}${wallet.address}.json`);
    const mmPath = join(dir, `.${prefix}${wallet.address}.json`);
    const walletPrefix = wallet.address.slice(0, 10);
    const walletSuffix = wallet.address.slice(34);
    console.log(`- wallet ${walletPrefix}..${walletSuffix} is saved to: ${filePath.toString()}`);
    this.keyMap[wallet.address] = filePath;
    writeFileSync(filePath, encryptJson);

    // save keyMap
    if (wallet.mnemonic) writeFileSync(mmPath, wallet.mnemonic.phrase);
  }

  print_wallet_info(w) {
    let maxLen;
    if (w.mnemonic) {
      maxLen = w.mnemonic.phrase.length + 22;
    } else {
      maxLen = 100;
    }
    const sep = `  ${'-'.repeat(maxLen + 3)}`;
    console.log(sep);
    console.log(`|>   [LOG] address: ${w.address}${' '.repeat(maxLen - 57)}|`);
    if (w.mnemonic) console.log(`|>   [LOG] *mnemonic: ${w.mnemonic?.phrase}     |`);
    console.log(`|>   [LOG] *private key: ${w.privateKey}${' '.repeat(maxLen - 86)}|`);
    console.log(sep);
  }
}
