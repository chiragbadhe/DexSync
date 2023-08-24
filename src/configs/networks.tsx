import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  bsc,
  avalanche,
  fantom,
  celo,
  gnosis,
  zkSync
} from "wagmi/chains";

export interface INetworkConfig {
  name: string;
  chainId: number;
  logo: string;
}

export const SUPPORTED_NETWORKS = [
  mainnet,
  polygon,
  arbitrum,
  optimism,
  bsc,
  avalanche,
  fantom,
  celo,
  gnosis,
  zkSync
];

export const NetworksConfig: INetworkConfig[] = SUPPORTED_NETWORKS.map(
  (chain) => {
    return {
      name: chain.name,
      chainId: chain.id,
      logo: `icons/chains/${chain.id}.svg`,
    };
  }
);

export const CONFIRMATION_WAIT_BLOCKS: { [chainId: number]: number } = {
  1: 1,
  137: 2,
  42161: 1,
  10: 1,
  56: 1,
  43114: 1,
  250: 1,
  42220: 1,
  100: 1,
};
