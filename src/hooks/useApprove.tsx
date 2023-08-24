import { useSwapStore } from "@/store/swap";
import { utils, constants } from "ethers";
import { useMemo, useState } from "react";
import { getExplorerLink } from "@/utils/getExplorerLink";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  erc20ABI,
  Address,
  useNetwork,
} from "wagmi";
import useSwap from "./useSwap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TransactionToast } from "@/components/common/TransactionToast";
import { CONFIRMATION_WAIT_BLOCKS } from "@/configs/networks";

const useApprove = () => {
  const { address: user } = useAccount();
  const { token0, amount, selectedQuote } = useSwapStore();
  const { fetchSwapParams } = useSwap();
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const { chain } = useNetwork();
  const [isApproveInfiniteLoading, setIsApproveInfiniteLoading] =
    useState(false);

  const { data: allowance, refetch } = useContractRead({
    address: token0.address as Address,
    abi: erc20ABI,
    functionName: "allowance",
    args: [user as Address, selectedQuote?.aggregatorAddress as Address],
  });

  const token0Decimals = useMemo(
    () => token0 && (token0.decimals || 18),
    [token0]
  );

  // approve prepare hook
  const { config: approveConfig, error: approveConfigError } =
    usePrepareContractWrite({
      address: token0.address as Address,
      abi: erc20ABI,
      functionName: "approve",
      args: [
        selectedQuote?.aggregatorAddress as Address,
        utils.parseUnits(amount ? amount : "0", token0Decimals),
      ],
    });

  // approve prepare hook
  const { config: approveInfiniteConfig } = usePrepareContractWrite({
    address: token0.address as Address,
    abi: erc20ABI,
    functionName: "approve",
    args: [selectedQuote?.aggregatorAddress as Address, constants.MaxUint256],
  });

  // approve call
  const {
    data: approveData,
    write: approve,
    isLoading: preApproveLoading,
  } = useContractWrite({
    ...approveConfig,
    onSuccess(data) {
      setIsApproveLoading(true);
      toast(
        <TransactionToast
          title="Transaction Submitted"
          link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
          type="success"
        />,
        {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
        }
      );
      data
        .wait(CONFIRMATION_WAIT_BLOCKS[chain?.id ?? 1])
        .then(async () => {
          await refetch();
          await fetchSwapParams();
          setIsApproveLoading(false);
          toast(
            <TransactionToast
              title={`Approved ${amount} ${token0.symbol}`}
              link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
              type="success"
            />,
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
            }
          );
        })
        .catch((e) => {
          toast(
            <TransactionToast
              title={`Failed to approve ${amount} ${token0.symbol}`}
              type="error"
              link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
            />,
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
            }
          );
        });
    },
  });

  // approve call
  const {
    data: approveInfiniteData,
    write: approveInfinite,
    isLoading: preInfiniteApproveLoading,
  } = useContractWrite({
    ...approveInfiniteConfig,
    onSuccess(data) {
      setIsApproveInfiniteLoading(true);
      toast(
        <TransactionToast
          title="Transaction Submitted"
          link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
          type="success"
        />,
        {
          position: toast.POSITION.TOP_RIGHT,
          hideProgressBar: true,
        }
      );
      data
        .wait(CONFIRMATION_WAIT_BLOCKS[chain?.id ?? 1])
        .then(async () => {
          await refetch();
          await fetchSwapParams();
          setIsApproveInfiniteLoading(false);
          toast(
            <TransactionToast
              title={`Approved ${amount} ${token0.symbol}`}
              link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
              type="success"
            />,
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
            }
          );
        })
        .catch((e) => {
          toast(
            <TransactionToast
              title={`Failed to approve ${amount} ${token0.symbol}`}
              link={getExplorerLink(chain?.id ?? 1, data.hash, "transaction")}
              type="error"
            />,
            {
              position: toast.POSITION.TOP_RIGHT,
              hideProgressBar: true,
            }
          );
        });
    },
  });

  return {
    allowance,
    approve,
    approveInfinite,
    isApproveLoading: preApproveLoading || isApproveLoading,
    isApproveInfiniteLoading:
      preInfiniteApproveLoading || isApproveInfiniteLoading,
  };
};

export default useApprove;
