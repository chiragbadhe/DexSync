import axios from "axios";
import {
  ISwapDataParams,
  ISwapDataReturn,
} from "../interfaces/ISwapInterfaces";
import { utils } from "ethers";
import { SwapResult } from "@/store/swap";

const getParaSwapQuote = async (
  params: ISwapDataParams
): Promise<ISwapDataReturn | undefined> => {
  try {
    const request = {
      srcToken: params.fromTokenAddress,
      destToken: params.toTokenAddress,
      amount: utils.parseUnits(params.amount, params.fromTokenDecimals),
      srcDecimals: params.fromTokenDecimals,
      destDecimals: params.toTokenDecimals,
      side: "SELL",
      network: params.network,
    };

    const data = await axios.get(`https://apiv5.paraswap.io/prices`, {
      params: request,
    });

    return {
      aggregatorName: "PARASWAP",
      aggregatorAddress: data.data?.priceRoute?.tokenTransferProxy,
      estimatedGas: data.data?.priceRoute?.gasCost,
      toTokenAmount: +utils.formatUnits(
        data.data.priceRoute.destAmount.toString(),
        params.toTokenDecimals
      ),
      priceRoute: data?.data.priceRoute,
    };
  } catch (error) {
    console.error("could not get paraswap quote", error);
  }
};

const getParaswapSwap = async (
  params: ISwapDataParams,
  fromAddress: string,
  slippage = 1 // 1%
): Promise<SwapResult> => {
  try {
    const request = {
      srcToken: params.fromTokenAddress,
      destToken: params.toTokenAddress,
      srcDecimals: params.fromTokenDecimals,
      destDecimals: params.toTokenDecimals,
      srcAmount: utils
        .parseUnits(params.amount, params.fromTokenDecimals)
        .toString(),
      slippage: slippage * 100,
      userAddress: fromAddress,
      priceRoute: params.priceRoute,
    };

    const { data } = await axios.post(
      `https://apiv5.paraswap.io/transactions/${params.network}`,
      request
    );

    return {
      aggregatorName: "PARASWAP",
      estimatedGas: data?.gas,
      tx: {
        to: data.to,
        data: data.data,
        gas: Number(data?.gas),
      },
      toTokenAmount: utils.formatUnits(
        request.priceRoute.destAmount,
        params.toTokenDecimals
      ),
    };
  } catch (error) {
    throw Error("Something Went Wrong");
  }
};

export { getParaSwapQuote, getParaswapSwap };
