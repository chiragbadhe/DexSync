import { useNetworkStore } from "@/store/swap";
import { utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { Address } from "wagmi";
import { fetchToken } from "wagmi/actions";

interface Token {
  name: string;
  symbol: string;
  decimals: number;
  address: string;
}

/**
 *
 * @param address address of the token
 * @returns token, isLoading, error, fetchTokenDetail
 */

const useTokenDetail = (address: string) => {
  const [token, setToken] = useState<Token[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const { selectedNetworkId } = useNetworkStore();

  const fetchTokenDetail = useCallback(() => {
    if (!address || !selectedNetworkId) return;
    if (!utils.isAddress(address)) return;

    setIsLoading(true);
    fetchToken({ address: address as Address, chainId: selectedNetworkId })
      .then((data) => {
        setToken([
          {
            name: data.name,
            symbol: data.symbol,
            decimals: data.decimals,
            address: data.address,
          },
        ]);
      })
      .catch((error) => {
        setError(error.message || error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [address, selectedNetworkId]);

  useEffect(() => {
    fetchTokenDetail();
  }, [fetchTokenDetail]);

  useEffect(() => {
    console.log({ token });
  }, [token]);

  return { token, isLoading, error, fetchTokenDetail };
};

export default useTokenDetail;
