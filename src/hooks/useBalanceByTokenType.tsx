import { useSwapStore } from "@/store/swap";
import { isNativeToken } from "@/utils";
import { useMemo } from "react";
import { useAccount, useBalance } from "wagmi";

export const useBalanceByTokenType = () => {
  const { address } = useAccount();
  const { token0: token } = useSwapStore();

  const {
    data: balance,
    isLoading,
    error,
    refetch: refetchErc20Balance,
  } = useBalance({
    address,
    token: token.address as `0x${string}`,
  });

  const {
    data: nativeBalance,
    isLoading: isNativeBalanceLoading,
    error: nativeBalanceError,
    refetch: refetchNativeBalance,
  } = useBalance({ address });

  const result = useMemo(() => {
    if (isNativeToken(token)) {
      return {
        balance: nativeBalance,
        isLoading: isNativeBalanceLoading,
        error: nativeBalanceError,
        refetch: refetchNativeBalance,
      };
    } else {
      return {
        balance,
        isLoading,
        error,
        refetch: refetchErc20Balance,
      };
    }
  }, [
    balance,
    error,
    isLoading,
    isNativeBalanceLoading,
    nativeBalance,
    nativeBalanceError,
    refetchErc20Balance,
    refetchNativeBalance,
    token,
  ]);

  return {
    balance: result.balance,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};
