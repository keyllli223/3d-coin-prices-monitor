import { ethers, Contract } from "ethers";

import bitcoin from '../coins/bitcoin.png'
import ethereum from '../coins/ethereum.png'
import cardano from '../coins/cardano.png'

const coinsInfo: any = {
    'bitcoin': bitcoin,
    'ethereum': ethereum,
    'cardano': cardano,
}


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
const ORACLE_ADDRESS = process.env.REACT_APP_ORACLE_ADDRESS as string
const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com");

export const fetchData = async (setFetchFinished: any, setData: any) => {
    try {
        const dataPricesArray: any = []
        const oracle = new Contract(ORACLE_ADDRESS, ORACLE_ABI, provider);
        const coinCounter = parseInt(await oracle.getCount());

        for (let i = 0; i < coinCounter; i++){
            let coinInfo = await oracle.getInfo(i + 1);
            dataPricesArray.push({
                name: `${coinInfo.name} price: $ ${coinInfo.price / 10 ** 8}`,
                image: coinsInfo[coinInfo.name]
            })
        }

        setData((prev: string[]) => [...prev, dataPricesArray.slice(0, 40)])
    } catch (err) {
        console.log(err)
    }
    setFetchFinished(true)
    return
}
