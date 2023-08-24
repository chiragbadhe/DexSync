/* eslint-disable @next/next/no-img-element */
// import Input from '../common/Input'
import AggregationChoices from "@/components/aggregation/choices/AggregationChoices";
import AggregationResults from "@/components/aggregation/results/AggregationResults";
import Setting from "../aggregation/choices/Setting";

const Index = () => {
  return (
    <div className="z-30 flex flex-col">
      <Setting />
      <div className=" flex  max-w-[700px] md:w-[700px]  flex-col items-center justify-center md:p-[20px]">
        <div className="flex md:max-w-[700px] w-full bg-gray-custom-100  p-[20px] border border-gray-custom-200">
          <AggregationChoices />
        </div>

        <div className="mt-[24px] flex w-full max-w-[700px]  bg-gray-custom-100 p-[20px] border border-gray-custom-200">
          <AggregationResults />
        </div>
      </div>
    </div>
  );
};

export default Index;
