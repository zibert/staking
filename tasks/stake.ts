import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

import config from '../config.json'

task("stake")
    .addParam("amount", "amount of tokens")
    .setAction(async (args, hre) => {
        let amount = hre.ethers.utils.parseEther(args.amount)

        let signers = await hre.ethers.getSigners();
        let acc = signers[0]

        const uniswapV2Pair = (await hre.ethers.getContractAt("IUniswapV2Pair", config.pairAddress))

        const staking = (await hre.ethers.getContractFactory("Stacking")).attach(config.stackingAddress);
        await uniswapV2Pair.approve(staking.address, amount);

        const options = {
            gasLimit: 1000000
        }

        await staking.stake(amount, options);
    });