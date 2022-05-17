import { ethers } from "hardhat";

import config from '../config.json'

async function main() {
  const Stacking = await ethers.getContractFactory("Stacking");
  const stacking = await Stacking.deploy(config.zcoinAddress, config.pairAddress);

  await stacking.deployed();

  console.log("Stacking deployed to: ", stacking.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
