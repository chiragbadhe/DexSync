import { useEffect, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import { useSwapStore, useNetworkStore } from "@/store/swap";
import useApprove from "@/hooks/useApprove";
import { useNetwork, useSwitchNetwork } from "wagmi";
import useSwap from "@/hooks/useSwap";
import { useBalanceByTokenType } from "@/hooks/useBalanceByTokenType";
import { formatEther, formatUnits } from "ethers/lib/utils.js";
import useAggregation from "@/hooks/useAggregation";

const SwapButton = () => {
  enum ButtonStatus {
    ALL_OK = "Swap",
    SWITCH_NETWORK = "Switch Network",
    WALLET_NOT_CONNECTED = "Connect Wallet",
    INSUFFICIENT_BALANCE = "Insufficient Balance",
    TOKENS_NOT_SELECTED = "Please select tokens",
    NO_AMOUNT = "Enter Amount",
    APPROVE = "Approve",
    SWAP_DATA_LOADING = "Loading Swap Data...",
  }

  const buttonBaseClasses =
    "py-[16px] text-center text-[16px] text-white font-medium  font-general-sans border border-[#6F3CE4]";

  const [buttonStatus, setButtonStatus] = useState<ButtonStatus>(
    ButtonStatus.ALL_OK
  );

  const { isConnected } = useAccount();
  const { amount, selectedQuote, token0, token1, resetToken0, resetToken1 } =
    useSwapStore();
  const { selectedNetworkId } = useNetworkStore();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { swap, isLoading, isSwapDataLoading } = useSwap();
  const { balance } = useBalanceByTokenType();
  const { isLoading: areQuotesLoading } = useAggregation();

  const {
    allowance,
    approve,
    approveInfinite,
    isApproveLoading,
    isApproveInfiniteLoading,
  } = useApprove();

  useEffect(() => {
    if (isConnected) {
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!isConnected) {
      setButtonStatus(ButtonStatus.WALLET_NOT_CONNECTED);
    } else if (chain?.id != selectedNetworkId) {
      setButtonStatus(ButtonStatus.SWITCH_NETWORK);
    } else if (!token0.address || !token1.address) {
      setButtonStatus(ButtonStatus.TOKENS_NOT_SELECTED);
    } else if (!Number(amount)) {
      setButtonStatus(ButtonStatus.NO_AMOUNT);
    } else if (Number(balance?.formatted) < Number(amount)) {
      setButtonStatus(ButtonStatus.INSUFFICIENT_BALANCE);
    } else if (
      selectedQuote &&
      selectedQuote.aggregatorAddress &&
      allowance &&
      Number(formatUnits(allowance, token0.decimals)) < Number(amount)
    ) {
      setButtonStatus(ButtonStatus.APPROVE);
    } else if (isSwapDataLoading || areQuotesLoading) {
      setButtonStatus(ButtonStatus.SWAP_DATA_LOADING);
    } else {
      setButtonStatus(ButtonStatus.ALL_OK);
    }
  }, [
    ButtonStatus.ALL_OK,
    ButtonStatus.APPROVE,
    ButtonStatus.INSUFFICIENT_BALANCE,
    ButtonStatus.NO_AMOUNT,
    ButtonStatus.SWAP_DATA_LOADING,
    ButtonStatus.SWITCH_NETWORK,
    ButtonStatus.TOKENS_NOT_SELECTED,
    ButtonStatus.WALLET_NOT_CONNECTED,
    allowance,
    amount,
    areQuotesLoading,
    balance?.formatted,
    chain?.id,
    isConnected,
    isSwapDataLoading,
    selectedNetworkId,
    selectedQuote,
    selectedQuote?.aggregatorAddress,
    selectedQuote?.toTokenAmount,
    token0,
    token1,
  ]);

  if (!isWalletConnected) {
    return (
      <>
        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, hide, address, ensName }) => {
            return (
              <button
                className={"bg-purple-primary" + " " + buttonBaseClasses}
                onClick={show}
              >
                {ButtonStatus.WALLET_NOT_CONNECTED}
              </button>
            );
          }}
        </ConnectKitButton.Custom>
      </>
    );
  } else {
    switch (buttonStatus) {
      case ButtonStatus.SWITCH_NETWORK:
        return (
          <button
            onClick={() => {
              resetToken0();
              resetToken1();
              switchNetwork?.(selectedNetworkId);
            }}
            className={"bg-purple-primary" + " " + buttonBaseClasses}
          >
            {ButtonStatus.SWITCH_NETWORK}
          </button>
        );

      case ButtonStatus.APPROVE:
        return (
          <div className="flex w-full gap-5">
            <button
              disabled={isApproveLoading}
              onClick={approve}
              className={"w-1/2 bg-purple-primary" + " " + buttonBaseClasses}
            >
              {isApproveLoading ? (
                <>
                  <div
                    className="inline-block h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </>
              ) : (
                ButtonStatus.APPROVE
              )}
            </button>

            <button
              onClick={approveInfinite}
              className={
                "w-1/2 bg-purple-primary  text-sm" + " " + buttonBaseClasses
              }
            >
              {isApproveInfiniteLoading ? (
                <>
                  <div
                    className="inline-block h-4 w-4 animate-spin  border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status"
                  >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                      Loading...
                    </span>
                  </div>
                </>
              ) : (
                <>Approve Infinite</>
              )}
            </button>
          </div>
        );

      case ButtonStatus.INSUFFICIENT_BALANCE:
        return (
          <button
            className={
              "cursor-not-allowed bg-purple-secondary" + " " + buttonBaseClasses
            }
          >
            {ButtonStatus.INSUFFICIENT_BALANCE}
          </button>
        );

      case ButtonStatus.NO_AMOUNT:
        return (
          <button
            className={
              "cursor-not-allowed bg-purple-secondary" + " " + buttonBaseClasses
            }
          >
            {ButtonStatus.NO_AMOUNT}
          </button>
        );

      case ButtonStatus.TOKENS_NOT_SELECTED:
        return (
          <button
            className={
              "cursor-not-allowed bg-purple-secondary" + " " + buttonBaseClasses
            }
          >
            {ButtonStatus.TOKENS_NOT_SELECTED}
          </button>
        );

      case ButtonStatus.SWAP_DATA_LOADING:
        return (
          <button
            disabled
            className={
              "cursor-not-allowed bg-purple-secondary" + " " + buttonBaseClasses
            }
          >
            <div className="flex w-full items-center justify-center space-x-2">
              <div
                className="inline-block h-4 w-4 animate-spin rounded-full  border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              <span>{ButtonStatus.SWAP_DATA_LOADING}</span>
            </div>
          </button>
        );

      default:
        return (
          <button
            onClick={() => {
              swap();
            }}
            className={"bg-purple-primary" + " " + buttonBaseClasses}
          >
            {isLoading ? (
              <>
                <div
                  className="inline-block h-4 w-4 animate-spin  border-4 rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </>
            ) : (
              <>{ButtonStatus.ALL_OK}</>
            )}
          </button>
        );
    }
  }
};

export default SwapButton;
