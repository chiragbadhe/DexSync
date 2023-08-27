/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { FC } from "react";
import axios from "axios";
import InputLabel from "@/components/common/InputLabel";
import { useNetworkStore, useSwapStore } from "@/store/swap";
import Modal from "@/components/common/Modal";
import { Input } from "@/shared/input";
import useModal from "@/hooks/useModal";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import ImageWithSymbolText from "@/shared/imageWithSymbolText";
import useAggregation from "@/hooks/useAggregation";
import useTokenDetail from "@/hooks/useTokenDetail";
import { getTokenListUrl } from "@/utils/getTokenListUrl";
import { useNetwork } from "wagmi";
import { useBalanceByTokenType } from "@/hooks/useBalanceByTokenType";
import { useRouter } from "next/router";
import { getQuery } from "@/utils/common";
import useTokenBalance from "@/hooks/useTokenBalance";

interface SelectTokenProps {
  isToken0?: boolean;
  selectedToken: any;
  setSelectedToken: any;
  balanceToken: any;
}

const SelectToken: FC<SelectTokenProps> = ({
  isToken0,
  selectedToken,
  setSelectedToken,
  balanceToken,
}) => {
  const router = useRouter();
  const { query } = router;
  const [tokens, setTokens] = useState<object[]>([]);
  const [gettingTokenList, setGettingTokenlist] = useState(false);
  const [searchBoxText, setSearchBoxText] = useState("");
  const [newToken, setNewToken] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const { isShowing, toggle } = useModal();
  const [token, setToken] = useLocalStorage("token", {});
  const { selectedNetworkId } = useNetworkStore();

  const updateRoute = (name: string, value: any) => {
    router.replace({
      pathname: "/",
      query: {
        ...query,
        ["chain"]: selectedNetworkId.toString(),
        [name]: value,
      },
    });
  };
  const {
    setToken0,
    setToken1,
    token0,
    token1,
    resetAmount,
    resetToken0,
    resetToken1,
    resetSelectedQuote,
  } = useSwapStore();

  const { token: searchedToken, isLoading: tokenSearchLoading } =
    useTokenDetail(searchBoxText);

  useEffect(() => {
    setIsloading(tokenSearchLoading);
    if (searchBoxText && searchedToken && searchedToken.length) {
      setNewToken(searchedToken as any);
    }
  }, [searchBoxText, searchedToken, tokenSearchLoading]);

  useEffect(() => {
    resetToken0();
    resetToken1();
    resetAmount();
    resetSelectedQuote();
    setSelectedToken(null);
  }, []);

  useEffect(() => {
    setGettingTokenlist(true);

    axios
      .get(`/api/fetchTokens?networkId=${selectedNetworkId}`)
      .then(({ data }) => {
        console.log(data);
        const tokenList = data.tokens;
        let tokenListData: any = [];

        if (Array.isArray(tokenList)) {
          setTokens(tokenList);
          return;
        }

        Object.keys(tokenList).forEach((key) => {
          let tokenData = {
            value: tokenList[key].address,
            label: tokenList[key].name,
            logoURI: tokenList[key].logoURI,
            address: tokenList[key].address,
            symbol: tokenList[key].symbol,
            decimals: tokenList[key].decimals,
          };

          tokenListData.push(tokenData);
        });
        if (token) {
          const savedToken = (token as any)[selectedNetworkId];
          savedToken &&
            savedToken.length &&
            savedToken.map((key: any) => {
              tokenListData.push(key);
            });
        }
        setTokens(tokenListData);

        const queryChain: any = getQuery("chain");
        const queryFrom: any = getQuery("from");
        const queryTo: any = getQuery("to");
        if (selectedNetworkId === parseInt(queryChain) && isToken0) {
          if (queryFrom === null) {
            let tokenArray: any = tokenListData[0];
            setToken0(tokenArray);
            setSelectedToken(tokenArray);
            updateRoute("from", tokenArray.address);
          }
        }
        if (queryChain && selectedNetworkId === parseInt(queryChain)) {
          if (queryFrom && isToken0) {
            setToken0(
              tokenListData.filter(
                (event: any) => event.address == queryFrom
              )[0]
            );
            setSelectedToken(
              tokenListData.filter(
                (event: any) => event.address == queryFrom
              )[0]
            );
          }
          if (queryTo && !isToken0) {
            setToken1(
              tokenListData.filter((event: any) => event.address == queryTo)[0]
            );
            setSelectedToken(
              tokenListData.filter((event: any) => event.address == queryTo)[0]
            );
          }
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setGettingTokenlist(false);
      });
  }, [token, selectedNetworkId, isToken0, setToken0, setToken1]);

  const hideModal = () => {
    setSearchBoxText("");
    setNewToken([]);
    toggle();
  };
  const filteredTokens = useMemo(() => {
    if (isToken0) {
      if (token1 && token1.address) {
        return tokens.filter((token: any) => token.address !== token1.address);
      } else return tokens;
    } else {
      if (token0 && token0.address) {
        return tokens.filter((token: any) => token.address !== token0.address);
      } else return tokens;
    }
  }, [isToken0, token0, token1, tokens]);

  const selectToken = (tokenArray: any) => {
    if (isToken0) {
      setToken0({
        address: tokenArray?.address,
        symbol: tokenArray?.symbol,
        logoURI: tokenArray?.logoURI,
        decimals: tokenArray?.decimals,
      });
      updateRoute("from", tokenArray?.address);
    } else {
      setToken1({
        address: tokenArray?.address,
        symbol: tokenArray?.symbol,
        logoURI: tokenArray?.logoURI,
        decimals: tokenArray?.decimals,
      });
      updateRoute("to", tokenArray?.address);
    }
    setSelectedToken(tokenArray);
    hideModal();
  };

  const onAddNewToken = (tokenArray: any) => {
    const obj = {
      address: tokenArray?.address,
      decimals: tokenArray?.decimals,
      name: tokenArray?.name,
      symbol: tokenArray?.symbol,
      logoURI: "",
    };
    let newTokenArray: any = token;
    if (token) {
      if (selectedNetworkId in newTokenArray) {
        if (
          !newTokenArray[selectedNetworkId].filter(
            (token2: any) => token2.address === obj.address
          ).length
        ) {
          newTokenArray[selectedNetworkId].push({ obj });
          setToken(newTokenArray);
        }
      } else {
        Object.assign(newTokenArray, { [selectedNetworkId]: [obj] });
        setToken(newTokenArray);
      }
    } else {
      setToken({ [selectedNetworkId]: [obj] });
    }
    setNewToken([]);
    selectToken(obj);
  };

  let filterData = filteredTokens;
  if (searchBoxText.length) {
    filterData = filteredTokens.filter(
      (e: any) =>
        e.name?.toLowerCase().includes(searchBoxText) ||
        e.address === searchBoxText ||
        e.symbol?.toLowerCase().includes(searchBoxText)
    );
  } else {
    filterData = filteredTokens;
  }

  // if (
  //   searchBoxText.length &&
  //   !filteredTokens.filter((e: any) => e.address === searchBoxText).length
  // ) {
  //   let config = {
  //     headers: {
  //       accept: "application/json",
  //       "X-API-Key":
  //         "2LNARFOw16E4NQctzwTYPqnbeymx66UTuRLSUgQOj6ABMY3Tf6LvsfjGxqvIRHQU",
  //     },
  //   };
  //   axios
  //     .get(
  //       `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=eth&addresses%5B0%5D=${searchBoxText}`,
  //       config
  //     )
  //     .then((res: any) => {
  //       setIsloading(true);
  //       setNewToken(res?.data);
  //       setIsloading(false);
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }
  filterData = filterData.map((token: any) => {
    let balance = balanceToken.find(
      (balanceToken: any) => balanceToken?.address === token?.address
    )?.balance;
    Object.assign(token, { balance: balance ? balance : 0 });
    return token;
  });
  const featuredToken = (token: any, isDisable?: boolean) => {
    return (
      <button
        type="button"
        key={token.symbol}
        onClick={() => selectToken(token)}
        className={`flex space-x-2  border border-[#2B2B2B] bg-[#202429] py-[8px] pl-2 pr-3 ${
          ((!isToken0 && token0?.address) || (isToken0 && token1?.address)) ===
          token?.address
            ? "opacity-50"
            : " hover:bg-gray-custom-200"
        } `}
        disabled={
          ((!isToken0 && token0?.address) || (isToken0 && token1?.address)) ===
          token?.address
        }
      >
        <ImageWithSymbolText
          width={24}
          height={24}
          src={token?.logoURI}
          alt={token?.symbol}
          className="me-2"
          textSymbolShowOnError
          errorSymbolClassName={
            "w-[24px] text-white h-[24px] flex items-center leading-none justify-center bg-black "
          }
        />
        <span>{token.symbol}</span>
      </button>
    );
  };
  return (
    <div className="w-full font-general-sans">
      <button
        type="button"
        className="align-center flex w-full cursor-pointer border border-gray-custom-200 bg-gray-custom-300 px-[16px] py-[12px]"
        onClick={() => toggle()}
      >
        {selectedToken?.logoURI && (
          <ImageWithSymbolText
            width={23}
            height={20}
            src={selectedToken?.logoURI}
            alt={selectedToken?.symbol}
            textSymbolShowOnError
            className="me-2"
            errorSymbolClassName={
              "min-w-[23px] text-white min-h-[23px] items-center me-2 text-[9px] justify-center flex  bg-black "
            }
          />
        )}
        <div className="flex w-full items-center justify-between">
          <span>{selectedToken ? selectedToken.symbol : "Select Token"}</span>{" "}
          <span>
            <ChevronDown color="#C3C3C3" />
          </span>
        </div>
      </button>

      <Modal
        title={""}
        className="relative flex h-[672px] w-[464px] flex-col border  border-gray-custom-200 bg-gray-custom-100"
        isShowing={isShowing}
        hide={hideModal}
      >
        <div className="px-auto   sticky z-20 mx-auto w-full">
          <p className="mb-[8px]">Select Token</p>
          <Input
            placeholder=" Search name or paste address"
            className="w-full  border-gray-custom-200 bg-gray-custom-300 px-[16px] py-[12px] font-medium  opacity-60  focus:outline-none"
            onKeyUp={(e: any) => {
              let { value } = e.target;
              if (value.length > 2) {
                let valueLower = value.toLowerCase();
                setSearchBoxText(valueLower);
              } else {
                setSearchBoxText("");
              }
            }}
          />
          <div className="w-full pt-[24px]">
            <div className="border-b border-[#2B2B2B] "></div>
          </div>
        </div>

        <div className=" input-search-result z-20 -ml-[16px] -mr-[16px] overflow-auto scroll-smooth pt-[16px]">
          {gettingTokenList && <li>Loading... </li>}
          <div>
            {filterData &&
              filterData
                .sort((tokenA: any, tokenB: any) => {
                  return tokenB.balance - tokenA.balance;
                })
                .map((token: any, index: Number) => {
                  return (
                    <div
                      key={"token_no_" + index}
                      onClick={() => selectToken(token)}
                      id={token.symbol}
                      className="flex items-center justify-between px-[16px] py-[10px] hover:cursor-pointer hover:bg-gray-custom-200"
                    >
                      <div
                        role="button"
                        className=" flex items-center justify-center space-x-[12px] "
                      >
                        <ImageWithSymbolText
                          width={38}
                          height={38}
                          src={token?.logoURI}
                          alt={token?.symbol}
                          textSymbolShowOnError
                          errorSymbolClassName={
                            "min-w-[38px] text-white min-h-[38px] items-center  text-[12px] justify-center flex  bg-black  "
                          }
                        />
                        <p className="flex w-full  flex-col">
                          <span className="text-[18px] leading-[18px]">
                            {token.symbol}
                          </span>
                          <span className="mt-[6px] text-[12px] leading-[18px] opacity-60">
                            {token.symbol}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="font-dm-mono">
                          {token?.balance
                            ? parseFloat(Number(token?.balance).toFixed(4))
                            : 0}
                        </p>
                      </div>
                    </div>
                  );
                })}
          </div>
          {isLoading ? (
            <li>Loading...</li>
          ) : (
            <>
              {searchBoxText && !filterData.length && (
                <>
                  {newToken &&
                  newToken.length &&
                  token0.address !== searchBoxText &&
                  token1.address !== searchBoxText ? (
                    newToken.map((token: any, index: Number) => {
                      return (
                        <>
                          <div
                            key={"token_no_" + index}
                            onClick={() => selectToken(token)}
                            id={token.symbol}
                            className=" flex items-center justify-between px-[16px] py-[10px] align-middle hover:bg-gray-custom-200"
                          >
                            <div
                              role="button"
                              className=" flex items-center justify-center space-x-[12px] "
                            >
                              <ImageWithSymbolText
                                width={38}
                                height={38}
                                src={token?.logoURI}
                                alt={token?.symbol}
                                textSymbolShowOnError
                                errorSymbolClassName={
                                  "min-w-[38px] text-white min-h-[38px] items-center  text-[12px] justify-center flex  bg-black  "
                                }
                              />
                              <p className="flex w-full  flex-col">
                                <span className="text-[18px] leading-[18px]">
                                  {token.name}
                                </span>
                                <span className="mt-[6px] text-[12px] leading-[18px] opacity-60">
                                  {token.symbol}
                                </span>
                              </p>
                            </div>
                            <div>
                              <button
                                className="w-fit border border-[#60B5A0] bg-purple-primary px-[8px] py-[5px] text-center font-general-sans text-[16px] font-medium text-white
                                "
                                type="button"
                                onClick={() => onAddNewToken(token)}
                                id={token.symbol}
                              >
                                Add token
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })
                  ) : (
                    <p className="px-[16px]">No token found</p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

const SelectTokens = () => {
  const [selectedToken0, setSelectedToken0] = useState<any>(null);
  const [selectedToken1, setSelectedToken1] = useState<any>(null);
  const {
    token0,
    token1,
    setToken0,
    setToken1,
    setAmount,
    resetToken0,
    resetToken1,
  } = useSwapStore();
  const { getAggregationResult } = useAggregation();
  const { selectedNetworkId } = useNetworkStore();
  const { chain } = useNetwork();
  const { refetch } = useBalanceByTokenType();
  const { balance, getTokenBalance } = useTokenBalance();
  const flipTokens = useCallback(() => {
    if (token0 && token0.address && token1 && token1.address) {
      setToken0(token1);
      setToken1(token0);
      setAmount("");
      setSelectedToken0(selectedToken1);
      setSelectedToken1(selectedToken0);
      getAggregationResult();
      refetch?.();
    }
  }, [
    getAggregationResult,
    refetch,
    selectedToken0,
    selectedToken1,
    setAmount,
    setToken0,
    setToken1,
    token0,
    token1,
  ]);

  useEffect(() => {
    getTokenBalance();
    setSelectedToken0(null);
    setSelectedToken1(null);
  }, [selectedNetworkId, chain]);
  return (
    <section className=" bg-gray-custom-100">
      <InputLabel label="Select Token" />
      <div className="flex">
        <SelectToken
          isToken0
          selectedToken={selectedToken0}
          setSelectedToken={setSelectedToken0}
          balanceToken={balance ? balance : []}
        />

        <div className="flex items-center px-[7px] opacity-50 hover:cursor-pointer">
          <ChevronRight size={32} onClick={flipTokens} />
        </div>
        <SelectToken
          selectedToken={selectedToken1}
          setSelectedToken={setSelectedToken1}
          balanceToken={balance ? balance : []}
        />
      </div>
    </section>
  );
};

export default SelectTokens;
