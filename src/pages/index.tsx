import styles from "@/styles/Home.module.css";
import localFont from "@next/font/local";

// components
import Navbar from "../components/common/Navbar";
import Index from "../components/pages/Index";
import { appState } from "@/store/app";
import { useEffect } from "react";
import { useNetwork, useProvider } from "wagmi";
import { utils } from "ethers";
import axios from "axios";
import { useNetworkStore, useSwapStore } from "@/store/swap";
import { isEmptyObject } from "@/utils";

import {
  mainnet,
  polygon,
  arbitrum,
  optimism,
  bsc,
  avalanche,
  fantom,
  celo,
  gnosis,
  zkSync,
} from "wagmi/chains";
import { ExclamationIcon } from "@/components/common/Icons";

const RpcByChainId: { [chainId: number]: string } = {
  1: mainnet.rpcUrls.default.http[0],
  137: polygon.rpcUrls.default.http[0],
  42161: arbitrum.rpcUrls.default.http[0],
  10: optimism.rpcUrls.default.http[0],
  56: bsc.rpcUrls.default.http[0],
  43114: avalanche.rpcUrls.default.http[0],
  250: fantom.rpcUrls.default.http[0],
  42220: celo.rpcUrls.default.http[0],
  100: gnosis.rpcUrls.default.http[0],
  324: zkSync.rpcUrls.default.http[0],
};

const TokenIdByChainId: { [key: string]: string } = {
  "1": "ethereum", // mainnet
  "137": "matic-network", // polygon
  "10": "ethereum", // optimism
  "42161": "ethereum", // arbitrum
  "56": "binancecoin", // bsc
  "43114": "avalanche-2", // avalanche
  "250": "fantom", // fantom
  "42220": "celo", // celo
  "100": "xdai", // gnosis
  "324": "ethereum", // zksync
};

const PlatformByChainId: { [key: string]: string } = {
  "1": "ethereum",
  "137": "polygon-pos",
  "10": "optimistic-ethereum",
  "42161": "arbitrum-one",
  "56": "binance-smart-chain",
  "43114": "avalanche",
  "250": "fantom",
  "42220": "celo",
  "100": "xdai",
  "324": "ethereum",
};

// const RpcUrlByChainId: { [key: string]: string } = {
//   "1": "https://1rpc.io/eth",
//   "137": "https://polygon-rpc.com/",
//   "10": "https://mainnet.optimism.io",
//   "42161": "https://arb1.arbitrum.io/rpc",
// };

export default function Home() {
  const { setGasPrice, setNativeTokenPriceUsd } = appState();
  const { selectedNetworkId } = useNetworkStore();
  const { token1, setToken1PriceUsd } = useSwapStore();

  useEffect(() => {
    if (selectedNetworkId) {
      axios
        .post(RpcByChainId[selectedNetworkId], {
          id: 1,
          jsonrpc: "2.0",
          method: "eth_gasPrice",
        })
        .then(({ data }) => {
          if (data && data.result) {
            setGasPrice(parseFloat(utils.formatUnits(data.result, "gwei")));
          }
        })
        .catch((error) => {
          throw error;
        });
    }
  }, [selectedNetworkId, setGasPrice]);

  useEffect(() => {
    if (selectedNetworkId) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${
            TokenIdByChainId[selectedNetworkId.toString()]
          }&vs_currencies=usd`
        )
        .then(({ data }) => {
          setNativeTokenPriceUsd(
            data[TokenIdByChainId[selectedNetworkId.toString()]].usd
          );
        })
        .catch((e) => {
          throw e;
        });
    }
  }, [selectedNetworkId, setNativeTokenPriceUsd]);

  useEffect(() => {
    if (token1 && token1.address) {
      axios
        .get(
          `https://api.coingecko.com/api/v3/simple/token_price/${
            PlatformByChainId[selectedNetworkId]
          }?contract_addresses=${token1.address.toLowerCase()}&vs_currencies=usd`
        )
        .then(({ data }) => {
          if (!isEmptyObject(data)) {
            setToken1PriceUsd(data[token1.address.toLowerCase()].usd);
          }
        })
        .catch((e) => {
          throw e;
        });
    }
  }, [selectedNetworkId, setToken1PriceUsd, token1]);

  return (
    <>
      <Navbar />
      <main className="relative z-10 h-full w-full overflow-hidden px-[8px] pb-[100px] items-center justify-center flex flex-col">
        <Index/>
        <img src="/texture.svg" className="absolute opacity-80 top-0 h-full object-cover	" alt="" />
      </main>
    </>
  );
}
