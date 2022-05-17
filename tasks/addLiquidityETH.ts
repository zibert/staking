import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("addLiquidityETH")
    .addParam("ether", "ether")
    .addParam("zcoins", "zcoins")
    .setAction(async (args, hre) => {

        let signers = await hre.ethers.getSigners();
        let acc1 = signers[0]

        let provider = await hre.ethers.getDefaultProvider();

        const zcoin = (await hre.ethers.getContractFactory("Zcoin")).attach(config.zcoinAddress);

        const uniswapV2Router02 = (await hre.ethers.getContractAt("IUniswapV2Router02", config.uniswapV2Router02address))

        let factoryAddress = await uniswapV2Router02.factory();
        let wethAddress = await uniswapV2Router02.WETH();

        const uniswapV2Factory = (await hre.ethers.getContractAt("IUniswapV2Factory", factoryAddress))

        let poolAdresse = await uniswapV2Factory.getPair(zcoin.address, wethAddress);
        await zcoin.approve(poolAdresse, hre.ethers.utils.parseEther(args.zcoins));

        const options = {
            value: hre.ethers.utils.parseEther(args.ether),
            gasLimit: 1000000
        }

        let lastblock = await provider.getBlock(provider._lastBlockNumber);

        await uniswapV2Router02.addLiquidityETH(
            zcoin.address,
            hre.ethers.utils.parseEther(args.zcoins),
            hre.ethers.utils.parseEther(args.ether),
            hre.ethers.utils.parseEther(args.zcoins),
            acc1.address,
            lastblock.timestamp + 3600,
            options);

        const uniswapV2Pair = (await hre.ethers.getContractAt("IUniswapV2Pair", factoryAddress))

        let uniVsBalance = await uniswapV2Pair.balanceOf(acc1.address);
        console.log("UNI-V2 balance: " + uniVsBalance);
    });