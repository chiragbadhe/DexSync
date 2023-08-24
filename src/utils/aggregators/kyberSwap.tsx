import axios from "axios";
import {
  ISwapDataParams,
  ISwapDataReturn,
} from "../interfaces/ISwapInterfaces";
import { utils } from "ethers";
import { SwapResult } from "@/store/swap";
import { DEFAULT_GAS_LIMIT } from "@/configs";

const ConfigByChainId: {
  [key: string]: string;
} = {
  "1": "ethereum",
  "137": "polygon",
  "10": "optimism",
  "42161": "arbitrum",
  "56": "bsc",
  "43114": "avalanche",
  "250": "fantom",
};

const getKyberSwapQuote = async (
  params: ISwapDataParams
): Promise<ISwapDataReturn | undefined> => {
  try {
    const request = {
      tokenIn: params.fromTokenAddress,
      tokenOut: params.toTokenAddress,
      amountIn: utils.parseUnits(params.amount, params.fromTokenDecimals),
      to: params.account,
      saveGas: 0,
      gasInclude: 1,
      clientData: { source: "DexSync" },
    };

    const { data } = await axios.get(
      `https://aggregator-api.kyberswap.com/${
        ConfigByChainId[params.network.toString()]
      }/route/encode`,
      {
        params: request,
      }
    );

    return {
      aggregatorName: "KYBERSWAP",
      aggregatorAddress: data?.routerAddress,
      estimatedGas:
        params.network === 10 || params.network === 42161
          ? +DEFAULT_GAS_LIMIT
          : data?.totalGas,
      toTokenAmount: +utils.formatUnits(
        data?.outputAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    console.error("could not get kyberswap quote", error);
  }
};

const getKyberswapSwap = async (
  params: ISwapDataParams,
  address: string
): Promise<SwapResult> => {
  try {
    const request = {
      tokenIn: params.fromTokenAddress,
      tokenOut: params.toTokenAddress,
      amountIn: utils.parseUnits(params.amount, params.fromTokenDecimals),
      to: params.account,
      saveGas: 0,
      gasInclude: 1,
      clientData: { source: "dexsync" },
    };

    const { data } = await axios.get(
      `https://aggregator-api.kyberswap.com/${
        ConfigByChainId[params.network.toString()]
      }/route/encode`,
      {
        params: request,
      }
    );

    return {
      aggregatorName: "KYBERSWAP",
      estimatedGas: data?.totalGas,
      tx: {
        to: data?.routerAddress,
        data: data?.encodedSwapData,
        gas:
          params.network === 10 || params.network === 42161
            ? Number(DEFAULT_GAS_LIMIT)
            : Number(data?.totalGas),
      },
      toTokenAmount: utils.formatUnits(
        data?.outputAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    throw Error("Something Went Wrong");
  }
};

export { getKyberSwapQuote, getKyberswapSwap };
