import {
  Web3Function,
  Web3FunctionContext,
} from "@gelatonetwork/web3-functions-sdk";
import { Contract } from "ethers";
import ky from "ky";

const ORACLE_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "addCoin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "timeStamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "coinId",
        "type": "uint256"
      }
    ],
    "name": "PriceUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_coinId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "updatePrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "coinCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "count",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_coinId",
        "type": "uint256"
      }
    ],
    "name": "getInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastUpdated",
            "type": "uint256"
          }
        ],
        "internalType": "struct Oracle.CoinInfo",
        "name": "_info",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

Web3Function.onRun(async (context: Web3FunctionContext) => {
  const { userArgs, gelatoArgs, provider } = context;

  const oracleAddress = (userArgs.oracle as string) ?? "CONTRACT_ADDRESS";
  let oracle;
  let coinCounter;

  try {
    oracle = new Contract(oracleAddress, ORACLE_ABI, provider);
    coinCounter = parseInt(await oracle.getCount());
  } catch (err) {
    return { canExec: false, message: `Rpc call failed` };
  }


  for (let i = 0; i < coinCounter; i++){
    let coinInfo = await oracle.getInfo(i + 1);

    const nextUpdateTime = parseInt(coinInfo.lastUpdated) + 1800;
    const timestamp = gelatoArgs.blockTime;

    if (timestamp >= nextUpdateTime) {
      let price = 0;
      try {
        const coingeckoApi = `https://api.coingecko.com/api/v3/simple/price?ids=${coinInfo.name}&vs_currencies=usd`;

        const priceData: { [key: string]: { usd: number } } = await ky
            .get(coingeckoApi, { timeout: 5_000, retry: 0 })
            .json();
        price = Math.floor(priceData[coinInfo.name].usd * 10 ** 8);
      } catch (err) {
        return { canExec: false, message: `Coingecko call failed` };
      }

      return {
        canExec: true,
        callData: oracle.interface.encodeFunctionData("updatePrice", [i + 1, price]),
      };
    }
  }

  return { canExec: false, message: `Wainting...` };
});
