import InputAmount from "@/components/aggregation/choices/InputAmount";
import SelectNetwork from "@/components/aggregation/choices/SelectNetwork";
import SelectTokens from "@/components/aggregation/choices/SelectTokens";
import SwapSlippage from "@/components/aggregation/choices/SwapSlippage";
import SwapButton from "@/components/aggregation/choices/SwapButton";
import SwapDetails from "@/components/SwapDetails";

const AggregationChoices = () => {
  return (
    <>
      <div className="flex w-full flex-col space-y-[24px] ">
        <SelectNetwork />
        <SelectTokens />
        <InputAmount />
        <SwapSlippage />
        <SwapDetails />
        <SwapButton />
      </div>
    </>
  );
};

export default AggregationChoices;
