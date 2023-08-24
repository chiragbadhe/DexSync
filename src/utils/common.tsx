import { utils } from "ethers";

const parseUnits = (amount: number, decimals: number) => {
  return utils.parseUnits(amount.toString(), decimals).toString();
};

const formatUnits = (amount: string, decimals: number) => {
  return parseFloat(utils.formatUnits(amount.toString(), decimals));
};

const toFixed = (amount: number) => {
  return amount.toFixed(3);
};
const getQuery = (queryKey: string) => {
  const data = window.location.search;
  const params = new URLSearchParams(data);
  return params.get(queryKey);
};
export { parseUnits, formatUnits, toFixed, getQuery };
