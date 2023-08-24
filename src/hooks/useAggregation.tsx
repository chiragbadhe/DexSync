import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  IAggregationResult,
  getMatchaQuote,
  getOneInchQuote,
  getParaSwapQuote,
  getKyberSwapQuote,
  getOpenOceanQuote,
} from "@/utils/aggregators";

import { useSwapStore, useNetworkStore, SwapResult } from "@/store/swap";
import { useAccount } from "wagmi";
import { appState } from "@/store/app";
import { useLocalStorage } from "usehooks-ts";
import { AggregatorName, quoteState } from "@/store/quotes";
import { isNativeToken } from "@/utils";
import AggregationResult from "@/components/aggregation/results/AggregationResultSingle";
import {
  ISwapDataParams,
  ISwapDataReturn,
} from "@/utils/interfaces/ISwapInterfaces";

const useAggregation = () => {
  const { address: account } = useAccount();
  const { aggregationResults, setAggregationResults } = quoteState();
  const [isLoading, setIsLoading] = useState(false);
  const {
    token0,
    token1,
    amount,
    token1PriceUsd,
    setSelectedQuote,
    selectedQuote,
  } = useSwapStore();

  const { selectedNetworkId } = useNetworkStore();
  const { gasPrice, nativeTokenPriceUsd } = appState();
  const [unselectAggregators, setUnselectAggregators] = useLocalStorage(
    "unselectAggregators",
    [] as string[]
  );

  const applySetting = (checked: boolean, value: string) => {
    let aggregatorArray = unselectAggregators.filter(
      (aggregators: string) => aggregators !== value
    );

    checked
      ? setUnselectAggregators(aggregatorArray)
      : setUnselectAggregators([...unselectAggregators, value]);

    if (checked) {
      getAggregationResult();
    }
  };

  useEffect(() => {
    if (
      selectedQuoteRef.current &&
      unselectAggregators.includes(selectedQuoteRef.current.aggregatorName)
    ) {
      setSelectedQuote(aggregationResults[0]);
    }
  }, [aggregationResults, setSelectedQuote, unselectAggregators]);

  const [promises, setPromises] = useState<Promise<any>[]>([]);

  const getAggregationResult = useCallback(() => {
    if (token0.address && token1.address && Number(amount) > 0) {
      setAggregationResults([]);
      setIsLoading(true);

      const params: ISwapDataParams = {
        network: selectedNetworkId,
        fromTokenAddress: token0.address,
        toTokenAddress: token1.address,
        amount,
        fromTokenDecimals: token0.decimals,
        toTokenDecimals: token1.decimals,
        gasPrice,
        account,
      };

      const PROMISE_CONFIG: Record<
        AggregatorName,
        (params: ISwapDataParams) => Promise<ISwapDataReturn | undefined>
      > = {
        PARASWAP: getParaSwapQuote,
        MATCHA: getMatchaQuote,
        KYBERSWAP: getKyberSwapQuote,
        OPENOCEAN: getOpenOceanQuote,
        "1INCH": getOneInchQuote,
      };

      const promises = Object.entries(PROMISE_CONFIG)
        .filter(([name]) => !unselectAggregators.includes(name))
        .map(([, func]) => func(params));

      setPromises(promises);

      Promise.allSettled(promises)
        .then((results) =>
          results.filter(
            (result) => result.status === "fulfilled" && result.value
          )
        )
        .then((fulfilledResults) => {
          // @ts-ignore
          return fulfilledResults.map((result) => result.value);
        })
        .then((data) => {
          return data.map((quote) => {
            const usdEquivalent =
              quote.toTokenAmount *
              (isNativeToken(token1) ? nativeTokenPriceUsd : token1PriceUsd);
            const estimatedGasUsd =
              ((+quote.estimatedGas * gasPrice) / 1e9) * nativeTokenPriceUsd;
            const amountAfterFees = usdEquivalent - estimatedGasUsd;

            return {
              ...quote,
              amountAfterFees,
              amountUSD: usdEquivalent,
            };
          });
        })
        .then((data) => {
          const sortedData = data.sort((a, b) => {
            return a.amountAfterFees < b.amountAfterFees ? 1 : -1;
          });
          setAggregationResults(sortedData);
        })
        .catch((error) => {
          console.error(error.message || error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [
    token0.address,
    token0.decimals,
    token1,
    amount,
    setAggregationResults,
    selectedNetworkId,
    gasPrice,
    account,
    unselectAggregators,
    nativeTokenPriceUsd,
    token1PriceUsd,
  ]);

  useEffect(() => {
    if (!amount) setAggregationResults([]);
  }, [amount, setAggregationResults]);

  const timerRef = useRef<any>();

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (token0.address && token1.address && Number(amount) > 0) {
      timerRef.current = setTimeout(() => {
        getAggregationResult();
      }, 200);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [token0, token1, amount, getAggregationResult]);

  const selectedQuoteRef = useRef(selectedQuote);

  useEffect(() => {
    selectedQuoteRef.current = selectedQuote;
  }, [selectedQuote]);

  useEffect(() => {
    if (aggregationResults && aggregationResults.length) {
      let selectedQuote = selectedQuoteRef.current;
      if (selectedQuote && selectedQuote.aggregatorAddress) {
        const quote = aggregationResults.find(
          (e) => e.aggregatorAddress === selectedQuote?.aggregatorAddress
        );
        setSelectedQuote(quote ?? aggregationResults[0]);
      } else {
        setSelectedQuote(aggregationResults[0]);
      }
    }
  }, [aggregationResults, setSelectedQuote]);

  return {
    aggregationResults: isLoading
      ? promises.map((promise, i) => (
          <>
            <Quote promise={promise} index={i} />
          </>
        ))
      : aggregationResults.map((e, i) => (
          <>
            <Quote
              promise={Promise.resolve(e)}
              index={i}
              aggregationResults={aggregationResults}
            />
          </>
        )),
    token: token1,
    isLoading,
    getAggregationResult,
    applySetting,
  };
};

export const Quote = ({
  promise,
  index,
  aggregationResults,
}: {
  promise: Promise<ISwapDataReturn>;
  index: number;
  aggregationResults?: IAggregationResult[];
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<
    (ISwapDataReturn & IAggregationResult) | null
  >(null);
  const { gasPrice, nativeTokenPriceUsd } = appState();
  const {
    token1: token,
    setSelectedQuote,
    selectedQuote,
    token1PriceUsd,
  } = useSwapStore();

  const [unselectAggregators] = useLocalStorage(
    "unselectAggregators",
    [] as string[]
  );

  const bestQuote = useMemo(
    () => aggregationResults?.[0],
    [aggregationResults]
  );

  useEffect(() => {
    setIsLoading(true);

    promise
      .then((data) => {
        const usdEquivalent =
          data.toTokenAmount *
          (isNativeToken(token) ? nativeTokenPriceUsd : token1PriceUsd);
        console.log({ gas: data.estimatedGas, gasPrice, nativeTokenPriceUsd });

        const estimatedGasUsd =
          ((+data.estimatedGas * gasPrice) / 1e9) * nativeTokenPriceUsd;
        const amountAfterFees = usdEquivalent - estimatedGasUsd;

        setResult({ ...data, amountAfterFees, amountUSD: usdEquivalent });
      })
      .catch(console.error)
      .finally(() => {
        setIsLoading(false);
      });
  }, [gasPrice, nativeTokenPriceUsd, promise, token, token1PriceUsd]);

  if (result && unselectAggregators.includes(result.aggregatorName))
    return null;

  return (
    <>
      {isLoading ? (
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
      ) : (
        result && (
          <div
            onClick={() => {
              setSelectedQuote({
                ...result,
                amountUSD:
                  result.toTokenAmount *
                  (isNativeToken(token) ? nativeTokenPriceUsd : token1PriceUsd),
              });
            }}
          >
            <AggregationResult
              toTokenAmount={result.toTokenAmount}
              estimatedGasUsd={
                ((+result.estimatedGas * gasPrice) / 1e9) * nativeTokenPriceUsd
              }
              toTokenSymbol={token.symbol}
              aggregatorName={result.aggregatorName}
              index={index}
              selected={
                result.aggregatorAddress === selectedQuote?.aggregatorAddress
              }
              usdEquivalent={
                result.toTokenAmount *
                (isNativeToken(token) ? nativeTokenPriceUsd : token1PriceUsd)
              }
              bestQuote={bestQuote}
            />
          </div>
        )
      )}
    </>
  );
};

export default useAggregation;
