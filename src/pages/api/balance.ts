import { moralis_URL } from "@/configs";
import { formatUnits } from "@/utils/common";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
const getNetworkKeyName = (networkId: Number) => {
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

const getBalance = async (address: any, selectedNetworkId: any) => {
  const request = {
    headers: {
      accept: "application/json",
      "X-API-Key":
        "2LNARFOw16E4NQctzwTYPqnbeymx66UTuRLSUgQOj6ABMY3Tf6LvsfjGxqvIRHQU",
    },
  };
  let tokenBalance: any = [];
  const secondaryTokenBalance = await axios.get(
    `${moralis_URL}/${address}/erc20?chain=${getNetworkKeyName(
      selectedNetworkId
    )}`,

    request
  );
  secondaryTokenBalance?.data &&
    secondaryTokenBalance?.data.length > 0 &&
    secondaryTokenBalance?.data.map((token: any) => {
      tokenBalance.push({
        address: token.token_address,
        balance: formatUnits(token?.balance, token?.decimals),
      });
    });

  const primaryTokenBalance = await axios.get(
    `${moralis_URL}/${address}/balance?chain=${getNetworkKeyName(
      selectedNetworkId
    )}`,

    request
  );
  tokenBalance.push({
    address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    balance: formatUnits(primaryTokenBalance?.data?.balance, 18),
  });
  return tokenBalance;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(401).send("ALLOWED REQUEST: POST");
  }

  const { address, selectedNetworkId }: any = req.body.headers;

  try {
    const tokenBalance = await getBalance(address, selectedNetworkId);
    return res.status(200).json({ tokenBalance });
  } catch (error: any) {
    return res.json({ tokenBalance: []  });
  }
}
