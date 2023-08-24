import { create } from "zustand";
import { IAggregationResult } from "@/utils/aggregators";
import { AggregatorName } from "./quotes";

interface INetwork {
  selectedNetworkId: number;
  setSelectedNetworkId: (networkId: number) => void;
}

export interface Token {
  address: string;
  symbol: string;
  logoURI: string;
  decimals: number;
}

export interface SwapResult {
  aggregatorName: AggregatorName;
  estimatedGas: number | string;
  tx: {
    to: string;
    data: string;
    gas: number;
  };
  toTokenAmount: string;
}

interface ISwapData {
  token0: Token;
  token1: Token;
  token1PriceUsd: number;
  amount: string;
  slippage: number;
  selectedQuote: IAggregationResult | null;
  setToken0: (token: Token) => void;
  resetToken0: () => void;
  setToken1: (token: Token) => void;
  setToken1PriceUsd: (price: number) => void;
  resetToken1: () => void;
  setAmount: (amount: string) => void;
  resetAmount: () => void;
  setSlippage: (slippage: number) => void;
  setSelectedQuote: (expectedOutput: IAggregationResult) => void;
  resetSelectedQuote: () => void;
}

export const useNetworkStore = create<INetwork>((set) => ({
  selectedNetworkId: 137,
  setSelectedNetworkId: (networkId) =>
    set(() => ({ selectedNetworkId: networkId })),
}));

export const useSwapStore = create<ISwapData>((set) => ({
  token0: {
    address: "",
    symbol: "",
    logoURI: "",
    decimals: 0,
  },
  token1: {
    address: "",
    symbol: "",
    logoURI: "",
    decimals: 0,
  },
  token1PriceUsd: 0,
  amount: "",
  slippage: 0.5,
  selectedQuote: null,
  setToken0: (data: Token) =>
    set(() => ({
      token0: {
        address: data.address,
        symbol: data.symbol,
        logoURI: data.logoURI,
        decimals: data.decimals,
      },
    })),

  setToken1PriceUsd: (price: number) => set(() => ({ token1PriceUsd: price })),

  resetToken0: () =>
    set({
      token0: {
        address: "",
        symbol: "",
        logoURI: "",
        decimals: 0,
      },
    }),

  setToken1: (data: Token) =>
    set(() => ({
      token1: {
        address: data.address,
        symbol: data.symbol,
        logoURI: data.logoURI,
        decimals: data.decimals,
      },
    })),

  resetToken1: () =>
    set({
      token1: {
        address: "",
        symbol: "",
        logoURI: "",
        decimals: 0,
      },
    }),

  setAmount: (amount) => set(() => ({ amount })),
  resetAmount: () => set({ amount: "" }),

  setSlippage: (slippage) => set(() => ({ slippage: slippage })),

  setSelectedQuote: (selectedQuote) =>
    set(() => ({
      selectedQuote: {
        aggregatorName: selectedQuote.aggregatorName,
        aggregatorAddress: selectedQuote.aggregatorAddress,
        toTokenAmount: selectedQuote.toTokenAmount,
        estimatedGas: selectedQuote.estimatedGas,
        priceRoute: selectedQuote.priceRoute,
        amountAfterFees: selectedQuote.amountAfterFees,
        amountUSD: selectedQuote.amountUSD,
      },
    })),

  resetSelectedQuote: () => {
    set({
      selectedQuote: null,
    });
  },
}));
