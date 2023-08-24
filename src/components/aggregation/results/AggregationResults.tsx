import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import AggregationResult from "@/components/aggregation/results/AggregationResultSingle";
import useAggregation from "@/hooks/useAggregation";
import { useSwapStore } from "@/store/swap";
import { appState } from "@/store/app";
import { RefreshIcon } from "@/components/common/Icons";
import { isNativeToken } from "@/utils";

const AggregationResultSkeleton = () => {
  return (
    <div
      className={
        "cursor-pointer  border border-gray-custom-200/40 bg-transparent px-[12px] py-[14px] "
      }
    >
      <div className="flex">
        <div className="flex items-center space-x-2">
          <div className="skeleton h-[22px] w-[215px] animate-pulse " />
        </div>
        <div className="ml-auto">
          <div className="skeleton h-[22px]  w-[70px] animate-pulse " />
        </div>
      </div>

      <div className="mt-[8px] flex">
        <div className="">
          <div className="skeleton h-[11px] w-[115px] animate-pulse " />
        </div>
        <div className="ml-auto">
          <div className="skeleton h-[11px] w-[164px] animate-pulse " />
        </div>
      </div>
    </div>
  );
};

const AggregationResults = () => {
  const [showAggregationModel, setShowAggregationModel] = useState(false);

  const {
    selectedQuote,
    setSelectedQuote,
    token1PriceUsd,
    token0,
    token1,
    amount,
  } = useSwapStore();
  const { gasPrice, nativeTokenPriceUsd } = appState();
  const { aggregationResults, token, isLoading, getAggregationResult } =
    useAggregation();

  useEffect(() => {
    const checkToken =
      token0.address && token1.address && Number(amount) ? true : false;
    setShowAggregationModel(checkToken);
  }, [token0, token1, amount]);

  return (
    <section className="bg-gray-custom-40  w-full ">
      {!showAggregationModel ? (
        <div className="flex h-full w-full  flex-col items-center justify-center ">
          <div className=" "></div>
          <div className=" space-y-[8px] text-center">
            <p className="font-general-sans text-[20px]  font-medium opacity-70">
              Best meta aggregator ever built
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col py-[35px]">
          <div className="flex w-full justify-between">
            <p className="flex flex-col">
              <span className="text-[16px]">Select a route for a swap</span>
              <span className="text-[14px] text-[#6F767E]">
                Best route is selected based on net output after gas fees
              </span>
            </p>
            {aggregationResults && (
              <div>
                <button type="button" onClick={() => getAggregationResult()}>
                  <RefreshIcon color="#ffffff" width={20} height={20} />
                </button>
              </div>
            )}
          </div>
          <div className="mt-[24px] space-y-[16px]">{aggregationResults}</div>
        </div>
      )}
    </section>
  );
};

export default AggregationResults;
