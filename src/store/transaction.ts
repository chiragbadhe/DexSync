import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Token } from "./swap";
import { IAggregationResult } from "@/utils/aggregators";

export type Status = "PENDING" | "SUCCESS" | "FAILED";

export interface Transaction {
  address: string;
  id: string;
  fromToken: Token;
  toToken: Token;
  amount: string;
  quote: IAggregationResult | null;
  date: number;
  status: Status;
  chain: number;
  amountUSD?: string;
}

interface TransactionHistory {
  transactions: Transaction[];
  setTransaction: (transactions: any[]) => void;
}

export const useTransactionPersistStore = create(
  persist<TransactionHistory>(
    (set) => ({
      transactions: [],
      setTransaction: (transactions) => set(() => ({ transactions })),
    }),
    { name: "transaction.store" }
  )
);
