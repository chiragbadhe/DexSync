import { SwapResult } from "@/store/swap";
import {
  ISwapDataParams,
  ISwapDataReturn,
} from "../interfaces/ISwapInterfaces";
import axios from "axios";
import { utils } from "ethers";

const getNetworkKeyName = (networkId: Number) => {
  switch (networkId) {
    case 1:
      return "eth";
    case 56:
      return "bsc";
    case 137:
      return "polygon";
    case 100:
      return "xdai";
    case 250:
      return "fantom";
    case 43114:
      return "avax";
    case 42161:
      return "arbitrum";
    case 10:
      return "optimism";
  }
};
const getOpenOceanQuote = async (
  params: ISwapDataParams
): Promise<ISwapDataReturn | undefined> => {
  try {
    const request = {
      chain: getNetworkKeyName(params.network),
      inTokenAddress: params.fromTokenAddress,
      outTokenAddress: params.toTokenAddress,
      amount: params.amount,
      gasPrice: params.gasPrice,
      slippage: params.slippage,
    };

    const { data } = await axios.get(
      `https://open-api.openocean.finance/v3/${getNetworkKeyName(
        params.network
      )}/quote`,
      {
        params: request,
      }
    );

    return {
      aggregatorName: "OPENOCEAN",
      aggregatorAddress: "0x6352a56caadc4f1e25cd6c75970fa768a3304e64",
      estimatedGas: Number(data.data.estimatedGas),
      toTokenAmount: +utils.formatUnits(
        data?.data.outAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error: any) {
    console.error("could not get openocean quote", error);
  }
};

const getOpenOceanSwap = async (
  params: ISwapDataParams
): Promise<SwapResult> => {
  try {
    const request = {
      inTokenAddress: params.fromTokenAddress,
      outTokenAddress: params.toTokenAddress,
      amount: params.amount,
      gasPrice: params.gasPrice,
      slippage: params.slippage,
      account: params.account,
    };

    const { data } = await axios.get(
      `https://open-api.openocean.finance/v3/${getNetworkKeyName(
        params.network
      )}/swap_quote`,
      {
        params: request,
      }
    );

    return {
      aggregatorName: "OPENOCEAN",
      estimatedGas: data.data?.estimatedGas,
      tx: {
        to: data.data?.to,
        data: data.data?.data,
        gas: Number(data.data?.estimatedGas),
      },
      toTokenAmount: utils.formatUnits(
        data.data?.outAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    throw Error("Something Went Wrong");
  }
};

export { getOpenOceanQuote, getOpenOceanSwap };
