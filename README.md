# Multiversx-orderbook 
A limit orderbook dex built on Multiversx.

# Introduction

![](./doc/screen.png)


 Multiversx orderbook is a limit orderbook dex built on Multiversx blockchain.
 By operating on a decentralized Multiversx network, the  Multiversx orderbook  promotes decentralization, eliminating the need for a central authority, no centralized fund custody, no KYC, fully decentralized. 
 The use of blockchain technology ensures transparency, as the orderbook and trade history can be publicly audited and verified.

 
 # Components
- Frontend 
    
    Frontend is the first place user to interact with the DEX. Provides a simple method for 
    traders to create and submit orders, allowing a trader to request an amount of token they wish to buy or sell, and a price point, and whether they want a limit or market order 
        
- Limit Orderbook Contract

    The smart contract is responsible for matching and verifying the order submitted by the off-chain engine as well as transfer respective assets between the trading parties.

    The smart contracts on the blockchain make sure the secure and transparent transactions.
     
- Matching Engine


    Key features and functionalities of the Multiversx orderbook engine include:

    Orderbook Management: It maintains an orderbook that contains buy and sell orders arranged based on price and time priority. The orderbook records all outstanding orders for a trading pair, including information such as price, quantity, and submission time.

    Matching Engine: The orderbook engine is responsible for matching buy and sell orders, finding order pairs that match in price and quantity, and executing trades. The matching rules can be configured based on the exchange's requirements, such as choosing price or time priority for matching.

    Trade Execution: Once a matching pair is found, the orderbook engine submits the trade to on-chain smart contract for order execution.

    Real-time Updates: The orderbook engine continuously updates the orderbook in real-time as new orders are placed, executed, or canceled. This allows traders to see the latest orderbook status and make informed trading decisions.


## Project Setup 
### Compile and Deploy Contracts 
- cd contract
- npm && npm build
- ./deploy.sh

### Dapp
- cd dapp
- yarn 
- yarn start-devnet

### Engine
- cd engine
- go mod tidy && go build 
- ./engine
 

### Built With

* Backend engine - Golang  
* Frontend Dapp - React 
* Smart contract - Rust 



 