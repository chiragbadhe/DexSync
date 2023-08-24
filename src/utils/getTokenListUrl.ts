export const getTokenListUrl = (chainId: number): string => {
  switch (chainId) {
    case 42220:
      return `https://raw.githubusercontent.com/celo-org/celo-token-list/main/celo.tokenlist.json`;
    default:
      return `https://api.1inch.dev/token/v1.2/${chainId}/token-list`;
  }
};

