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
    this.provider = new ethers.getDefaultProvider('https:/rpc.ankr.com/eth');
    this.keyMap = {};
    // this.provider = new InfuraProvider('mainnet', '072a6ccaaa1d4c059427b830eba0f320');
  }

  // async _fetchENSName(address) {
  //     try {
  //         const ensName = await this.provider.lookupAddress(address);

  //         if (ensName) {
  //             return ensName;
  //         } else {
  //             throw Error("No ENS name found")
  //         }
  //     } catch (error) {
  //         pino.Error("Failed to fetchENSName: ", error)
  //     }
  // }

  // async getSeed(mnemonic) {
  //     let seed = await mnemonicToSeed(mnemonic)
  //     console.log("seed: " + bufferToHex(seed))

  //     return seed
  // }

  fromPrivateKey(pk) {
    // const wallet = ethers.HDNodeWallet.fromSeed(pk).derivePath(ethers.defaultPath);
    const wallet = new ethers.Wallet(pk, this.provider);

    logger.info(wallet);
    // logger.info("The wallet is derived from the privarte key: ", wallet.address);

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

    logger.info('The wallet is derived from the mnemonic: ', wallet);

    return wallet;
  }

  static generateAccount(password) {
    const wallet = ethers.HDNodeWallet.createRandom(password);
    logger.info(`[LOG] Account generated: ${wallet.address}`);

    const encryptJson = wallet.encryptSync(password);
    return {
      address: wallet.address,
      mnemonic: wallet.mnemonic?.phrase,
      encryptJson,
    };
  }

  batchGenerateAccount(password, num) {
    const accs = [];
    for (let i = 0; i < num; i++) {
      const acc = this.generateAccount(password);
      accs.push(acc);
    }

    return accs;
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

  static recoverFromEncryptJson(password, encryptJson) {
    const wallet = ethers.Wallet.fromEncryptedJsonSync(encryptJson, password);
    logger.info(`The wallet recovered: ${JSON.stringify(wallet)}`);
    return wallet;
  }

  saveWallet(wallet, password, dir) {
    const encryptJson = wallet.encryptSync(password);
    const filePath = join(dir, `${wallet.address}.json`);
    logger.info(`The wallet is saved to: ${filePath.toString()}`);
    this.keyMap[wallet.address] = filePath;
    writeFileSync(filePath, encryptJson);
  }
}
