import { create } from "zustand";

interface AppStateProps {
  gasPrice: number;
  setGasPrice: (price: number) => void;
  nativeTokenPriceUsd: number;
  setNativeTokenPriceUsd: (price: number) => void;
}

export const appState = create<AppStateProps>((set) => ({
  gasPrice: 0,
  setGasPrice: (price) => set(() => ({ gasPrice: price })),
  nativeTokenPriceUsd: 0,
  setNativeTokenPriceUsd: (price) =>
    set(() => ({ nativeTokenPriceUsd: price })),
}));
