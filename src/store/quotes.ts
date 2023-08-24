import { create } from "zustand";
import { IAggregationResult } from "@/utils/aggregators";

export type AggregatorName =
  | "1INCH"
  | "PARASWAP"
  | "MATCHA"
  | "KYBERSWAP"
  | "OPENOCEAN";

interface QuoteStateProps {
  aggregationResults: IAggregationResult[];
  setAggregationResults: (results: IAggregationResult[]) => void;
  filteredAggregationResults: IAggregationResult[];
}

export const quoteState = create<QuoteStateProps>((set) => ({
  aggregationResults: [],
  setAggregationResults: (results) =>
    set(() => ({ aggregationResults: results })),
  filteredAggregationResults: [],
}));
