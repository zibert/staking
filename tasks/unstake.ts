import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("unstake")
    .setAction(async (args, hre) => {
        const staking = (await hre.ethers.getContractFactory("Stacking")).attach(config.stackingAddress);

        await staking.unstake();
    });