import axios from "axios";
import {
  ISwapDataParams,
  ISwapDataReturn,
} from "../interfaces/ISwapInterfaces";

import { utils } from "ethers";
import { SwapResult } from "@/store/swap";

const ConfigByChainId: {
  [key: string]: { baseUrl: string; address: string };
} = {
  "1": {
    baseUrl: "https://api.0x.org/",
    address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  "137": {
    baseUrl: "https://polygon.api.0x.org/",
    address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  "42161": {
    baseUrl: "https://arbitrum.api.0x.org/",
    address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  "10": {
    baseUrl: "https://optimism.api.0x.org/",
    address: "0xdef1abe32c034e558cdd535791643c58a13acc10",
  },
  "56": {
    baseUrl: "https://bsc.api.0x.org/",
    address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  "250": {
    baseUrl: "https://fantom.api.0x.org/",
    address: "0xdef189deaef76e379df891899eb5a00a94cbc250",
  },
  "42220": {
    baseUrl: "https://celo.api.0x.org/",
    address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
  "43114": {
    baseUrl: "https://avalanche.api.0x.org/",
    address: "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
  },
};

export const getMatchaQuote = async (
  params: ISwapDataParams
): Promise<ISwapDataReturn | undefined> => {
  try {
    const request = {
      sellToken: params.fromTokenAddress,
      buyToken: params.toTokenAddress,
      sellAmount: utils.parseUnits(params.amount, params.fromTokenDecimals),
      slippagePercentage: (params?.slippage ?? 1) / 100,
    };

    const data = await axios.get(
      `${ConfigByChainId[params.network.toString()].baseUrl}swap/v1/quote`,
      {
        params: request,
      }
    );

    return {
      aggregatorName: "MATCHA",
      aggregatorAddress: ConfigByChainId[params.network].address,
      estimatedGas: Number(data?.data.gas),
      toTokenAmount: +utils.formatUnits(
        data?.data.buyAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    console.error("could not get matcha quote", error);
  }
};

export const getMatchaSwap = async (
  params: ISwapDataParams
): Promise<SwapResult> => {
  try {
    const request = {
      sellToken: params.fromTokenAddress,
      buyToken: params.toTokenAddress,
      sellAmount: utils.parseUnits(params.amount, params.fromTokenDecimals),
      slippagePercentage: (params?.slippage ?? 1) / 100,
    };

    const { data } = await axios.get(
      `${ConfigByChainId[params.network.toString()].baseUrl}swap/v1/quote`,
      {
        params: request,
      }
    );
    return {
      aggregatorName: "MATCHA",
      estimatedGas: Number(data?.estimatedGas),
      tx: {
        to: data.to,
        data: data.data,
        gas: Number(data?.estimatedGas),
      },
      toTokenAmount: utils.formatUnits(data.buyAmount, params.toTokenDecimals),
    };
  } catch (error) {
    console.log(error);
    throw Error("Something Went Wrong");
  }
};
