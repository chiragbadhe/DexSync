import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  bsc,
  avalanche,
  fantom,
  celo,
  gnosis,
  zkSync,
} from "wagmi/chains";

const BLOCK_EXPLORER_PREFIXES: { [chainId: number]: string } = {
  1: mainnet.blockExplorers.etherscan.url,
  137: polygon.blockExplorers.etherscan.url,
  42161: arbitrum.blockExplorers.etherscan.url,
  10: optimism.blockExplorers.etherscan.url,
  56: bsc.blockExplorers.etherscan.url,
  43114: avalanche.blockExplorers.etherscan.url,
  250: fantom.blockExplorers.etherscan.url,
  42220: celo.blockExplorers.etherscan.url,
  100: gnosis.blockExplorers.etherscan.url,
  324: zkSync.blockExplorers.default.url,
};

export enum ExplorerDataType {
  TRANSACTION = "transaction",
  TOKEN = "token",
  ADDRESS = "address",
  BLOCK = "block",
}

/**
 * Return the explorer link for the given data and data type
 * @param chainId the ID of the chain for which to return the data
 * @param data the data to return a link for
 * @param type the type of the data
 */
export function getExplorerLink(
  chainId: number,
  data: string,
  type: string
): string {
  const prefix = BLOCK_EXPLORER_PREFIXES[chainId] ?? "#";

  switch (type) {
    case ExplorerDataType.TRANSACTION:
      return `${prefix}/tx/${data}`;

    case ExplorerDataType.TOKEN:
      return `${prefix}/token/${data}`;

    case ExplorerDataType.ADDRESS:
      return `${prefix}/address/${data}`;
    default:
      return `${prefix}`;
  }
}
