import { getOneInchQuote, getOneInchSwap } from "./oneInch";
import { getParaSwapQuote } from "./paraSwap";
import { getMatchaQuote } from "./matcha";
import { getKyberSwapQuote } from "./kyberSwap";
import { getOpenOceanQuote } from "./openOcean";
import { AggregatorName } from "@/store/quotes";

interface IAggregationResult {
  aggregatorName: AggregatorName;
  toTokenAmount: number;
  estimatedGas: number;
  aggregatorAddress: string;
  priceRoute?: any;
  amountAfterFees: number;
  amountUSD?: number;
}

export {
  getOneInchQuote,
  getOneInchSwap,
  getParaSwapQuote,
  getMatchaQuote,
  getKyberSwapQuote,
  getOpenOceanQuote,
};
export type { IAggregationResult };
