# Staking

# Install package

npm i

# Test

npx hardhat coverage<br />

# Deploy

## local

npx hardhat run --network localhost scripts/deploy.ts

## rinkeby

npx hardhat run --network rinkeby scripts/deploy.ts<br />

# Verify

## rinkeby

npx hardhat verify --network rinkeby --constructor-args arguments.js 0x731Fb7604e57Dc6f82D5fc7105195365411Ce6e4<br />

https://rinkeby.etherscan.io/address/0x731Fb7604e57Dc6f82D5fc7105195365411Ce6e4#code

# Tasks 

## getPairAddress example: 

npx hardhat getPairAddress --network rinkeby 

## createPair example: 

npx hardhat createPair --network rinkeby 

## addLiquidityETH example: 

npx hardhat addLiquidityETH --network rinkeby --ether 0.2 --zcoins 2.2

## addZcoinsToStackingAddress example: 

npx hardhat addZcoinsToStackingAddress --network rinkeby --zcoins 10.0

## stake example: 

npx hardhat stake --network rinkeby --amount 0.2

## claim example: 

npx hardhat claim --network rinkeby


## unstake example: 

npx hardhat unstake --network rinkeby


