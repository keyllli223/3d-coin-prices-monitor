# 3D Coin Prices Monitor

Check the prices of added coins (to smart contract) in an interactive way !

Powered by  [Gelato Web3 Functions](https://beta.app.gelato.network/)

----

- Video demo: https://www.youtube.com/watch?v=zMjJMI-_rDY
- Live demo app: https://3d-coin-prices-monitor.netlify.app/
- Smart contract: [Polygon Mumbai] https://mumbai.polygonscan.com/address/0xb9e31f840303394af3dc54ed8473af08e0de0195

----

## How it works ?

- The smart contract stores the info about added coins like price and the last update timestamp. [like an oracle]
- Only the contract owner can add new coins.
- Was created a web3 function on gelato [https://beta.app.gelato.network/] that updates the coins prices every 30 minutes. [the price from coingecko]

----

## Tech stack:

- React
- BabylonJs - 3d engine js library
- ethers.js - ethereum api js library
