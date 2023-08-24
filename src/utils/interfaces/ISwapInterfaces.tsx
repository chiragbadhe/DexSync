import { AggregatorName } from "@/store/quotes";

interface ISwapDataParams {
  network: number; // chainId of the network
  amount: string; // amount of tokens
  fromTokenAddress: string; // from token address
  toTokenAddress: string; // to token address
  fromTokenDecimals: number;
  toTokenDecimals: number;
  slippage?: number;
  priceRoute?: any;
  account?: string;
  gasPrice?: number;
}

interface ISwapDataReturn {
  aggregatorName: AggregatorName;
  aggregatorAddress: string;
  estimatedGas: number;
  toTokenAmount: number;
  priceRoute?: any;
}

export type { ISwapDataParams, ISwapDataReturn };
