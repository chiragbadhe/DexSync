import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const networkId = req.query.networkId || 1; // Default to network ID 1
    const apiUrl = `https://api.1inch.dev/swap/v5.2/${networkId}/tokens`;
    const response = await axios.get(apiUrl, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer MpWIoejDF2WnKsNevgMe1fzad6rULTcd`,
      },
    });

    const data = response.data;
    const tokenListData = Object.keys(data.tokens).map((key) => ({
      value: data.tokens[key].address,
      label: data.tokens[key].name,
      logoURI: data.tokens[key].logoURI,
      address: data.tokens[key].address,
      symbol: data.tokens[key].symbol,
      decimals: data.tokens[key].decimals,
    }));

    res.status(200).json({ tokens: tokenListData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
}
