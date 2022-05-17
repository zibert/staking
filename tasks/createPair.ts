import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("createPair")
  .setAction(async (args, hre) => {
    let signers = await hre.ethers.getSigners();
    let owner = signers[0]

    const zcoin = (await hre.ethers.getContractFactory("Zcoin")).attach(config.zcoinAddress);

    const uniswapV2Router02 = (await hre.ethers.getContractAt("IUniswapV2Router02", config.uniswapV2Router02address))

    let factoryAddress = await uniswapV2Router02.factory();
    let wethAddress = await uniswapV2Router02.WETH();

    const uniswapV2Factory = (await hre.ethers.getContractAt("IUniswapV2Factory", factoryAddress))
    
    await uniswapV2Factory.createPair(zcoin.address, wethAddress);
    let poolAdresse = await uniswapV2Factory.getPair(zcoin.address, wethAddress);
    console.log("pairAddress: " + poolAdresse)
  });