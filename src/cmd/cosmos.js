import { CosmosWallet } from '../chains/cosmos.js';

export const cosmosHandler = async (options) => {
  if (!options.chain) {
    return;
  }
  const cosmosWallet = new CosmosWallet(options.chain);
  if (options.generate) {
    if (options.generate === true) {
      const res = await cosmosWallet.generateAccount();
      console.log(res);
    } else {
      const reses = await cosmosWallet.batchGenerateAccount(options.generate);
      console.log(reses);
    }
  }
};
