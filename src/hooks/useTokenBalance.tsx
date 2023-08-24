import { BASE_URL } from "@/configs";
import { useNetworkStore } from "@/store/swap";
import { formatUnits } from "@/utils/common";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount } from "wagmi";

const getNetworkKeyName = (networkId: number) => {
  switch (networkId) {
    case 1:
      return "eth";
    case 56:
      return "bsc";
    case 137:
      return "polygon";
    case 100:
      return "xdai";
    case 250:
      return "fantom";
    case 43114:
      return "avax";
    case 42161:
      return "arbitrum";
    case 10:
      return "optimism";
  }
};
const useTokenBalance = () => {
  const { address } = useAccount();
  const [balance, setBalance] = useState<any>([]);
  const { selectedNetworkId } = useNetworkStore();
  const getTokenBalance = useCallback(() => {
    setBalance([]);

    const request = {
      headers: {
        accept: "application/json",
        "X-API-Key":
          "2LNARFOw16E4NQctzwTYPqnbeymx66UTuRLSUgQOj6ABMY3Tf6LvsfjGxqvIRHQU",
        address: address,
        selectedNetworkId: selectedNetworkId,
      },
    };
    axios
      .post(`${BASE_URL}/balance`, request)
      .then((res: any) => {
        setBalance(res.data.tokenBalance);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [selectedNetworkId]);

  const timerRef = useRef<any>();
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (selectedNetworkId) {
      timerRef.current = setInterval(() => {
        getTokenBalance();
      }, 30000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [selectedNetworkId, getTokenBalance]);
  return { balance, getTokenBalance };
};

export default useTokenBalance;
