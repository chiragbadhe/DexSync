export const QUOTE_REFRESH_TIME = 60000;
export const TRACKING_BYTE = "UL_dexsync";

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://dexsync.exchange/api"
    : "http://localhost:3000/api";

export const moralis_URL = "https://deep-index.moralis.io/api/v2";
export const DEFAULT_GAS_LIMIT = "6500000"; // 6.5M
