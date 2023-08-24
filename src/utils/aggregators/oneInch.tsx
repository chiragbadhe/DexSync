import { SwapResult } from "@/store/swap";
import {
  ISwapDataParams,
  ISwapDataReturn,
} from "../interfaces/ISwapInterfaces";
import axios from "axios";
import { utils } from "ethers";

export const SpenderByChainId = (chainId: number): string => {
  switch (chainId) {
    case 324:
      return `0x6e2b76966cbd9cf4cc2fa0d76d24d5241e0abc2f`;
    default:
      return `0x1111111254eeb25477b68fb85ed929f73a960582`;
  }
};

const getOneInchQuote = async (
  params: ISwapDataParams
): Promise<ISwapDataReturn | undefined> => {
  try {
    const { data } = await axios.get(
      `https://api.1inch.dev/swap/v5.2/${params.network}/quote`,
      {
        params: {
          fromTokenAddress: params.fromTokenAddress,
          toTokenAddress: params.toTokenAddress,
          amount: utils.parseUnits(params.amount, params.fromTokenDecimals),
        },
        headers: {
          accept: "application/json",
          Authorization: `Bearer MpWIoejDF2WnKsNevgMe1fzad6rULTcd`,
        },
      }
    );

    return {
      aggregatorName: "1INCH",
      aggregatorAddress: SpenderByChainId(params.network),
      estimatedGas: data?.estimatedGas,
      toTokenAmount: +utils.formatUnits(
        data?.toTokenAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    console.error("could not get 1inch quote", error);
  }
};

const getOneInchSwap = async (
  params: ISwapDataParams,
  fromAddress: string
): Promise<SwapResult> => {
  try {
    const request = {
      fromTokenAddress: params.fromTokenAddress,
      toTokenAddress: params.toTokenAddress,
      amount: utils.parseUnits(params.amount, params.fromTokenDecimals),
      fromAddress,
      slippage: params.slippage,
    };

    const { data } = await axios.get(
      `https://api.1inch.dev/swap/v5.2/${params.network}/swap`,
      {
        params: request,
        headers: {
          accept: "application/json",
          Authorization: `Bearer MpWIoejDF2WnKsNevgMe1fzad6rULTcd`,
        },
      }
    );

    return {
      aggregatorName: "1INCH",
      estimatedGas: data?.estimatedGas,
      tx: {
        to: data?.tx?.to,
        data: data?.tx?.data,
        gas: Number(data?.tx?.gas),
      },
      toTokenAmount: utils.formatUnits(
        data.toTokenAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    throw Error("Something Went Wrong");
  }
};

export { getOneInchQuote, getOneInchSwap };
