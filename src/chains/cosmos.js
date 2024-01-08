import bip39 from 'bip39';

import cosmosLib from 'cosmos-lib';
import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';

const { crypto } = cosmosLib;

export class CosmosWallet {
  constructor(prefix, provider) {
    this.prefix = prefix;
    this.provider = provider;
  }

  async generateAccount() {
    const mnemonic = bip39.generateMnemonic();
    const keys = crypto.getKeysFromMnemonic(mnemonic);
    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(keys.privateKey), this.prefix);
    const [account] = await wallet.getAccounts();
    return {
      wallet,
      mnemonic,
      account,
    };
  }

  async batchGenerateAccount(num) {
    Promise.all([this.generateAccount] * num);
  }
}
