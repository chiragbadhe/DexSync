import { Address, useAccount, useNetwork, useSigner } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { useNetworkStore, useSwapStore } from "@/store/swap";
import { getOneInchSwap } from "@/utils/aggregators/oneInch";
import { BigNumber, constants, utils } from "ethers";
import { useBalanceByTokenType } from "./useBalanceByTokenType";
import { TransactionToast } from "@/components/common/TransactionToast";
import { getExplorerLink } from "@/utils/getExplorerLink";
import { toast } from "react-toastify";
import { getParaswapSwap } from "@/utils/aggregators/paraSwap";
import { getKyberswapSwap } from "@/utils/aggregators/kyberSwap";
import { getMatchaSwap } from "@/utils/aggregators/matcha";
import { getOpenOceanSwap } from "@/utils/aggregators/openOcean";
import { appState } from "@/store/app";
import { isNativeToken, toHexString } from "@/utils";
import { CONFIRMATION_WAIT_BLOCKS } from "@/configs/networks";
import { BASE_URL, TRACKING_BYTE } from "@/configs";
import { Transaction, useTransactionPersistStore } from "@/store/transaction";
import useAggregation from "./useAggregation";
import axios from "axios";

const useSwap = () => {
  const [swapParams, setSwapParams] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isSwapDataLoading, setIsSwapDataLoading] = useState(false);
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { gasPrice } = appState();
  // get selected quote
  const { amount, token0, token1, slippage, selectedQuote } = useSwapStore();
  const { aggregationResults } = useAggregation();

  const { selectedNetworkId } = useNetworkStore();
  const { refetch: refetchBalance } = useBalanceByTokenType();
  const { data: signer } = useSigner();
  const transactions = useTransactionPersistStore(
    (state) => state.transactions
  );
  const setTransaction = useTransactionPersistStore(
    (state) => state.setTransaction
  );
  const fetchSwapParams = useCallback(async () => {
    if (
      token0.address &&
      token1.address &&
      token0.decimals &&
      token1.decimals &&
      chain &&
      amount &&
      slippage
    ) {
      try {
        let params;

        switch (selectedQuote && selectedQuote.aggregatorName) {
          case "PARASWAP":
            setIsSwapDataLoading(true);
            params = await getParaswapSwap(
              {
                amount,
                fromTokenAddress: token0.address,
                toTokenAddress: token1.address,
                fromTokenDecimals: token0.decimals,
                toTokenDecimals: token1.decimals,
                network: selectedNetworkId,
                slippage,
                priceRoute: selectedQuote?.priceRoute,
              },
              address as string
            ).finally(() => {
              setIsSwapDataLoading(false);
            });
            break;
          case "1INCH":
            setIsSwapDataLoading(true);
            params = await getOneInchSwap(
              {
                amount,
                fromTokenAddress: token0.address,
                toTokenAddress: token1.address,
                fromTokenDecimals: token0.decimals,
                toTokenDecimals: token1.decimals,
                network: chain?.id ?? 1,
                slippage,
              },
              address as string
            ).finally(() => {
              setIsSwapDataLoading(false);
            });
            break;
          case "MATCHA":
            setIsSwapDataLoading(true);
            params = await getMatchaSwap({
              amount,
              fromTokenAddress: token0.address,
              toTokenAddress: token1.address,
              fromTokenDecimals: token0.decimals,
              toTokenDecimals: token1.decimals,
              network: chain?.id ?? 1,
              slippage,
            }).finally(() => {
              setIsSwapDataLoading(false);
            });
            break;
          case "OPENOCEAN":
            setIsSwapDataLoading(true);
            params = await getOpenOceanSwap({
              amount,
              fromTokenAddress: token0.address,
              toTokenAddress: token1.address,
              fromTokenDecimals: token0.decimals,
              toTokenDecimals: token1.decimals,
              network: chain?.id ?? 1,
              slippage,
              account: address,
              gasPrice,
            }).finally(() => {
              setIsSwapDataLoading(false);
            });
            break;
          case "KYBERSWAP":
            setIsSwapDataLoading(true);
            params = await getKyberswapSwap(
              {
                amount,
                fromTokenAddress: token0.address,
                toTokenAddress: token1.address,
                fromTokenDecimals: token0.decimals,
                toTokenDecimals: token1.decimals,
                network: chain?.id ?? 1,
                slippage,
                account: address,
              },
              address as string
            ).finally(() => {
              setIsSwapDataLoading(false);
            });
            break;
          default:
            break;
        }

        setSwapParams(params);
      } catch (error) {
        console.log(error);
      }
    }
  }, [
    token0.address,
    token0.decimals,
    token1.address,
    token1.decimals,
    chain,
    amount,
    slippage,
    selectedQuote,
    selectedNetworkId,
    address,
    gasPrice,
  ]);

  // get swap params
  useEffect(() => {
    fetchSwapParams();
  }, [fetchSwapParams]);

  const [aggregatorAddress, setAggregatorAddress] = useState<string>();
  const [txData, setTxData] = useState<string>();
  const [gasLimit, setGasLimit] = useState<BigNumber>();

  useEffect(() => {
    if (swapParams && swapParams.tx) {
      setAggregatorAddress(swapParams.tx.to);
      setTxData(swapParams.tx.data);
      setGasLimit(
        BigNumber.from(
          Math.ceil(
            Number(swapParams.tx.gas) *
              (selectedQuote?.aggregatorName === "KYBERSWAP" ? 1.8 : 1.5)
          )
        )
      );
    }
  }, [selectedQuote?.aggregatorName, swapParams]);

  const swap = useCallback(() => {
    if (aggregatorAddress && txData && gasLimit) {
      setIsLoading(true);

      signer
        ?.sendTransaction({
          to: aggregatorAddress,
          data: `${txData}${toHexString(TRACKING_BYTE)}`,
          gasLimit: gasLimit,
          value: isNativeToken(token0)
            ? utils.parseEther(amount)
            : constants.Zero,
        })
        .then((data) => {
          setIsLoading(true);
          let transactionHistory: Transaction = {
            address: address as Address,
            id: data.hash,
            fromToken: token0,
            toToken: token1,
            amount: amount,
            date: Math.ceil(Date.now()),
            quote: selectedQuote,
            status: "PENDING",
            chain: selectedNetworkId,
            amountUSD: selectedQuote?.amountUSD?.toString(),
          };

          toast(
            <TransactionToast
              title="Transaction Submitted"
              type="success"
              link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
            />,
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
            }
          );
          data
            .wait(CONFIRMATION_WAIT_BLOCKS[chain?.id ?? 1])
            .then(() => {
              refetchBalance?.();
              transactionHistory["status"] = "SUCCESS";
              toast(
                <TransactionToast
                  title={`Swapped ${amount} ${token0.symbol} for ${token1.symbol}`}
                  type="success"
                  link={getExplorerLink(
                    chain?.id ?? 1,
                    data.hash,
                    "transaction"
                  )}
                />,
                {
                  position: toast.POSITION.TOP_RIGHT,
                  hideProgressBar: true,
                }
              );
            })
            .catch((error) => {
              transactionHistory["status"] = "FAILED";
              toast(
                <TransactionToast
                  title={`Failed to Swap ${amount} ${token0.symbol} for ${token1.symbol}`}
                  type="error"
                  link={getExplorerLink(
                    chain?.id ?? 1,
                    data.hash,
                    "transaction"
                  )}
                />,
                {
                  position: toast.POSITION.TOP_RIGHT,
                  hideProgressBar: true,
                }
              );
            })
            .finally(() => {
              setTransaction([...transactions, transactionHistory]);
              // save transaction in db
              axios
                .post(`${BASE_URL}/transaction/create`, {
                  ...transactionHistory,
                })
                .catch((e) => {
                  console.error(e);
                });
              setIsLoading(false);
            });
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [
    aggregatorAddress,
    txData,
    gasLimit,
    signer,
    token0,
    amount,
    address,
    token1,
    selectedQuote,
    selectedNetworkId,
    chain?.id,
    refetchBalance,
    setTransaction,
    transactions,
  ]);

  // return send transaction obj
  return {
    swap,
    isLoading,
    isSwapDataLoading,
    fetchSwapParams,
  };
};

export default useSwap;
