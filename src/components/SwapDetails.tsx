import { useSwapStore } from "@/store/swap";
import { useEffect } from "react";
import { toFixed } from "@/utils/common";

const SwapDetails = () => {
  const { selectedQuote, slippage, token1 } = useSwapStore();

  const getMinimumAmount = () => {
    return toFixed(
      Number(selectedQuote?.toTokenAmount) -
        (Number(selectedQuote?.toTokenAmount) * Number(slippage)) / 100
    );
  };

  return selectedQuote && selectedQuote?.toTokenAmount > 0 ? (
    <section className="space-y-[8px]  bg-[#16181A]/80 p-[12px]  text-[12px] text-[#6F767E] ">
      <div className="flex">
        <h1>Expected Output</h1>
        <h1 className="ml-auto">
          {toFixed(selectedQuote?.toTokenAmount)} {token1.symbol}
        </h1>
      </div>

      <div className="flex">
        <div>Minimum received (after slippage {Number(slippage)}%) </div>
        <h1 className="ml-auto">
          {getMinimumAmount()} {token1.symbol}
        </h1>
      </div>
    </section>
  ) : (
    <> </>
  );
};

export default SwapDetails;
