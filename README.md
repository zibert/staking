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

npx hardhat verify --network rinkeby 0x76ce4b51e8dab5af59c521452ecb0d76a3e014b0<br />

https://rinkeby.etherscan.io/address/0x76ce4b51e8dab5af59c521452ecb0d76a3e014b0#code

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


