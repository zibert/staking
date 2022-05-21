import { ethers, waffle, network } from 'hardhat'
import chai from 'chai'

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import ZcoinArtifacts from '../artifacts/contracts/token/Zcoin.sol/Zcoin.json'
import { Zcoin } from '../src/types/Zcoin'

import StackingArtifacts from '../artifacts/contracts/Stacking.sol/Stacking.json'
import { Stacking } from '../src/types/Stacking'

const { deployContract } = waffle
const { expect } = chai

describe('Stacking Common Test', () => {
  let zcoin: Zcoin;
  let lptoken: Zcoin;
  let stacking: Stacking;
  let signers: SignerWithAddress[]
  let owner: SignerWithAddress;
  let acc1: SignerWithAddress;
  let acc2: SignerWithAddress;
  let acc3: SignerWithAddress;

  const t100 = ethers.utils.parseEther("100.0");
  const t50 = ethers.utils.parseEther("50.0");

  const t1 = ethers.utils.parseEther("1.0");
  const t2 = ethers.utils.parseEther("2.0");
  const t3 = ethers.utils.parseEther("3.0");
  const t4 = ethers.utils.parseEther("4.0");
  const t5 = ethers.utils.parseEther("5.0");
  const t6 = ethers.utils.parseEther("6.0");
  const t7 = ethers.utils.parseEther("7.0");
  const t8 = ethers.utils.parseEther("8.0");
  const t9 = ethers.utils.parseEther("9.0");
  const t10 = ethers.utils.parseEther("10.0");

  const rewardPercentage = 10
  const reward = t1.div(rewardPercentage)

  const options = {
    gasLimit: 5000000
  }

  beforeEach(async () => {
    signers = await ethers.getSigners();
    let network = await ethers.provider.getNetwork();

    owner = signers[0];
    acc1 = signers[1];
    acc2 = signers[2];
    acc3 = signers[3];

    zcoin = (await deployContract(signers[0], ZcoinArtifacts)) as Zcoin
    lptoken = (await deployContract(signers[0], ZcoinArtifacts)) as Zcoin
    stacking = (await deployContract(signers[0], StackingArtifacts, [zcoin.address, lptoken.address])) as Stacking

    await zcoin.mint(stacking.address, t100);

    await lptoken.mint(owner.address, t10);
    await lptoken.approve(stacking.address, t10);
  })

  it('changeRewardPercentage is correct', async () => {
    await expect(stacking.connect(acc1).changeRewardPercentage(20)).to.be.revertedWith(
        "not owner"
      );
    
    await stacking.changeRewardPercentage(20);
    await stacking.stake(t1);

    await network.provider.send("evm_increaseTime", [10 * 60 + 1]) 
    await network.provider.send("evm_mine");

    await stacking.claim();

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100.sub(t1.div(100).mul(20)))
    expect((await zcoin.balanceOf(owner.address))).to.eq(t1.div(100).mul(20))
  })

  it('changetimeToReward is correct', async () => {
    await expect(stacking.connect(acc1).changetimeToReward(20)).to.be.revertedWith(
        "not owner"
      );
    
    await stacking.changetimeToReward(60 * 2);
    await stacking.stake(t1);

    await network.provider.send("evm_increaseTime", [2 * 60 + 1]) 
    await network.provider.send("evm_mine");

    await stacking.claim();

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100.sub(t1.div(100).mul(10)))
    expect((await zcoin.balanceOf(owner.address))).to.eq(t1.div(100).mul(10))
  })

  it('changetimeToUnstake is correct', async () => {
    await expect(stacking.connect(acc1).changetimeToUnstake(20)).to.be.revertedWith(
        "not owner"
      );
    
    await stacking.changetimeToUnstake(60 * 2);
    await stacking.stake(t1);

    await network.provider.send("evm_increaseTime", [2 * 60 + 1]) 
    await network.provider.send("evm_mine");

    await stacking.unstake();

    expect((await lptoken.balanceOf(stacking.address))).to.eq(0)
    expect((await lptoken.balanceOf(owner.address))).to.eq(t10)
  })


})
