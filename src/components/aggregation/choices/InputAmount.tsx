import InputLabel from "@/components/common/InputLabel";

import { useNetworkStore, useSwapStore } from "@/store/swap";
import { useBalanceByTokenType } from "@/hooks/useBalanceByTokenType";
import { useNetwork } from "wagmi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatUnits } from "ethers/lib/utils.js";
import { useRouter } from "next/router";
import { getQuery } from "@/utils/common";

const InputAmount = () => {
  const { token0, setAmount, amount } = useSwapStore();
  const router = useRouter();
  const { query } = router;
  const { chain } = useNetwork();
  const { selectedNetworkId } = useNetworkStore();

  const { balance } = useBalanceByTokenType();
  const updateRoute = (name: string, value: number) => {
    router.replace({
      pathname: "/",
      query: {
        ...query,
        [name]: value,
      },
    });
  };
  const handleInputChange = (event: any) => {
    const { value } = event.target;

    if (!isNaN(value)) {
      setAmount(value);
      updateRoute("amount", value);
    }
  };
  useEffect(() => {
    const queryChain = getQuery("chain");
    const queryFrom = getQuery("from");
    const queryTo = getQuery("to");
    const queryAmount = getQuery("amount");
    if (!!queryChain && (!!queryFrom || !!queryTo)) {
      queryAmount ? setAmount(Number(queryAmount).toString()) : setAmount("10");
    }
  }, [setAmount]);
  const handleMaxClick = () => {
    if (balance && balance.value) {
      const maxAmount = formatUnits(balance?.value, token0.decimals);
      setAmount(maxAmount);
      updateRoute("amount", parseInt(maxAmount));
    }
  };

  return (
    <section>
      <div className="flex justify-between font-normal ">
        <div>
          <InputLabel label="Amount" />
        </div>
        <div className="flex opacity-40">
          {token0 && token0.address && selectedNetworkId === chain?.id && (
            <div className="ml-auto ">
              Balance: &nbsp;
              {parseFloat(Number(balance?.formatted).toFixed(4))}{" "}
              {token0.symbol}
            </div>
          )}
        </div>
      </div>

      <div className="flex  border border-gray-custom-200 ">
        <input
          type="number"
          value={amount}
          className="text w-full  bg-gray-custom-300 p-2 pl-4 font-dm-mono font-medium focus:outline-none"
          onChange={handleInputChange}
          placeholder="0.0"
          min={0}
        />
        <button
          onClick={handleMaxClick}
          disabled={!token0.address}
          className="w-[69px]  border-l border-gray-custom-200 bg-gray-custom-300 px-[16px] py-[13px] disabled:cursor-not-allowed"
        >
          MAX
        </button>
      </div>
    </section>
  );
};

export default InputAmount;
