/*
* There would be multiple aggregators and each aggregator will have different API ID 
* The array needs to be populated as the dexes load the price
*/

import axios from 'axios'

const exchanges = [{
    title: "1Inch",
    name: "1inch",
    baseURI: "https://google.com",
    apiKey: "",
}]

const getBestPrice = async() => {}

const get1InchPrice = async() => {
    const data = await axios.post("https://api.1inch.io/v5.0/1/quote?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toTokenAddress=0x111111111117dc0aa78b770fa6a738034120c302&amount=10000000000000000", {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer MpWIoejDF2WnKsNevgMe1fzad6rULTcd`,
        },
    })
}

const get0xPrice = async() => {
    const data  = await axios.get("")
}

const getMatchaPrice = async() => {}