import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("addZcoinsToStackingAddress")
    .addParam("zcoins", "zcoins")
    .setAction(async (args, hre) => {
        const zcoin = (await hre.ethers.getContractFactory("Zcoin")).attach(config.zcoinAddress);
        await zcoin.mint(config.stackingAddress, hre.ethers.utils.parseEther(args.zcoins));
        const balance = await zcoin.balanceOf(config.stackingAddress);
        console.log(
          `balance are ${balance.toString()} zcoins for address ${config.stackingAddress}`
        );
    });