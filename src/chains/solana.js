import { join, dirname, basename, extname } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdir } from 'fs';

import { ethers, Mnemonic, LangEn, randomBytes } from 'ethers';
import bip39 from 'bip39';
import web3, { Keypair } from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';
import bs from 'bs58';
import crypto from 'crypto';
import { print_evm_wallet_info } from './ethereum.js';
import { ensureDirectoryExistence } from './utils.js';

const algorithm = 'aes-256-cbc';

class SolanaWallet {

    constructor() {
        this.connection = new web3.Connection(
            web3.clusterApiUrl('mainnet-beta'),
            'confirmed',
        );
    }

    create_wallet(keypair, mnemonic) {
        return {
            pubKey: keypair.publicKey.toBase58(),
            privKey: bs.encode(keypair.secretKey),
            mnemonic: mnemonic,
        };
    }

    fromPrivateKey(pk) {
        const wallet = this.create_wallet(web3.Keypair.fromSecretKey(Uint8Array.from(bs.decode(pk))));

        console.log('- Successfully imported your wallet from the private key:');
        print_evm_sol_wallet_info(wallet);

        return wallet;
    }
 
    fromMnemonic(mnemonic) {
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        // Solana use the ed25519 curve
        // m/44'/501'/0'/0'，501 is the SLIP-0044 coin type of Solana
        const derivedSeed = derivePath("m/44'/501'/0'/0'", seed.toString('hex')).key;

        const keypair = Keypair.fromSeed(derivedSeed);
        
        const wallet = this.create_wallet(keypair, mnemonic);

        return wallet;
    }

    #generateWallet(password, wordlist) {
        // generate ethereum mnemonic
        if (password === undefined) { password = ""; }
        if (wordlist === undefined) { wordlist = LangEn.wordlist(); }
        const mnemonicObj = Mnemonic.fromEntropy(randomBytes(16), password, wordlist);
        const mnemonic = mnemonicObj.phrase;
        
        const walletGenerated = this.fromMnemonic(mnemonic);
        
        print_evm_sol_wallet_info(walletGenerated);
        
        return walletGenerated;
    }

    batchGenerateWallets(num) {
        const wallets = [];
        for (let i = 0; i < num; i++){
            const wallet = this.#generateWallet();
            wallets.push(wallet);
        }

        return wallets;
    }

    test_generate() {
        return this.#generateWallet();
    }

    async #buildSolBatchTransferTx(sender, transfers) {
        let transaction = new web3.Transaction()
        for (let i = 0; i < transfers.length; i++) {
            let transfer = transfers[i]
    
            transaction = transaction.add(
                web3.SystemProgram.transfer({
                    fromPubkey: sender.publicKey,
                    toPubkey: transfer.recipient,
                    lamports: Math.floor(transfer.value * web3.LAMPORTS_PER_SOL),
                })
            )
        }
    
        return transaction
    }

    // TBD
    async batch_transfer_sol() {}
    
    async batch_collect_sol() {}

    async batch_transfer_spl_token() {}

    async batch_collect_spl_token() {}

    async saveWallet(wallet, password, dir, name) {
        console.log(wallet);

        const encryptJson = this.#encrypt(JSON.stringify(wallet), password);
        const prefix = `${name}-`

        const filePath = join(dir, `${prefix}${wallet.pubKey}.json`);

        const walletPrefix = wallet.pubKey.slice(0, 10);
        const walletSuffix = wallet.pubKey.slice(34);
        console.log(`- wallet ${walletPrefix}..${walletSuffix} is saved to: ${filePath.toString()}`);
        
        ensureDirectoryExistence(filePath);

        writeFileSync(filePath, JSON.stringify(encryptJson));
    }

    recoverFromEncryptJson(password, encryptJson) {
        return JSON.parse(this.#decrypt(encryptJson, password));
    }

    #encrypt(text, password) {
        const key = crypto.scryptSync(password, 'salt', 32);
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return { iv: iv.toString('hex'), encryptedData: encrypted };
    }

    #decrypt(encryptedObj, password) {
        const key = crypto.scryptSync(password, 'salt', 32);
        let decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(encryptedObj.iv, 'hex'));
        let decrypted = decipher.update(encryptedObj.encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}

const print_evm_sol_wallet_info = (w) => {
    let maxLen = w.privKey.length + 30;

    const sep = `  ${'-'.repeat(maxLen + 3)}`;
    console.log(sep);
    // prefix length = 27
    console.log(`|>   [LOG] solana pubKey: ${w.pubKey}${' '.repeat(maxLen - 21 - w.pubKey.length)}|`);
    // prefix length = 25
    console.log(`|>   [LOG] *private key: ${w.privKey}${' '.repeat(10)}|`);

    if (w.mnemonic) {
        const evm_wallet = ethers.Wallet.fromPhrase(w.mnemonic);
        print_evm_wallet_info(evm_wallet, maxLen);
    } else {
        console.log(sep);
    }
}

// const sw = new SolanaWallet()
// const w = sw.test_generate()

// sw.batchGenerateWallets(3)
// console.log("=========================== LOOOOOOO =====================")
// await sw.saveWallet(w, "123456", ".", "test");
// console.log("=========================== RECOVER =====================")
// const f = readFileSync(`test-${w.pubKey}.json`);

// const res = sw.recoverFromEncryptJson("123456", JSON.parse(f));
// console.log(res);