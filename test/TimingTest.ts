import { ethers, waffle, network } from 'hardhat'
import chai from 'chai'

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import ZcoinArtifacts from '../artifacts/contracts/token/Zcoin.sol/Zcoin.json'
import { Zcoin } from '../src/types/Zcoin'

import StackingArtifacts from '../artifacts/contracts/Stacking.sol/Stacking.json'
import { Stacking } from '../src/types/Stacking'

const { deployContract } = waffle
const { expect } = chai


describe('Stacking Timing Test', () => {
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
  const t4 = ethers.utils.parseEther("5.0");
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

  it('claim serial timing ', async () => {
    await stacking.stake(t1)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100)
    expect((await zcoin.balanceOf(owner.address))).to.eq(0)

    await network.provider.send("evm_increaseTime", [5 * 60]) // + 5 min
    await network.provider.send("evm_mine")

    await stacking.claim(options)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100)
    expect((await zcoin.balanceOf(owner.address))).to.eq(0)

    await stacking.stake(t1)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100)
    expect((await zcoin.balanceOf(owner.address))).to.eq(0)

    await network.provider.send("evm_increaseTime", [5 * 60 + 1]) // + 5 min
    await network.provider.send("evm_mine")

    await stacking.claim(options)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100.sub(reward))
    expect((await zcoin.balanceOf(owner.address))).to.eq(reward)

    await network.provider.send("evm_increaseTime", [60 * 5 + 1]) // + 5 min
    await network.provider.send("evm_mine")

    await stacking.claim(options)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100.sub(reward).sub(reward))
    expect((await zcoin.balanceOf(owner.address))).to.eq(reward.add(reward))

    await stacking.claim(options)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100.sub(reward).sub(reward))
    expect((await zcoin.balanceOf(owner.address))).to.eq(reward.add(reward))
  })

  it('claim long interval', async () => {
    await stacking.stake(t1)
    await stacking.stake(t1)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100)
    expect((await zcoin.balanceOf(owner.address))).to.eq(0)

    await network.provider.send("evm_increaseTime", [25 * 60]) // + 25 min
    await network.provider.send("evm_mine")

    await stacking.claim(options)

    expect((await zcoin.balanceOf(stacking.address))).to.eq(t100.sub(reward).sub(reward))
    expect((await zcoin.balanceOf(owner.address))).to.eq(reward.add(reward))
  })


  it('unstake serial timing', async () => {
    expect((await lptoken.balanceOf(owner.address))).to.eq(t10)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(0)

    await stacking.stake(t1)

    expect((await lptoken.balanceOf(owner.address))).to.eq(t9) // 10 - 1
    expect((await lptoken.balanceOf(stacking.address))).to.eq(t1) // 0 + 1

    await stacking.unstake()

    expect((await lptoken.balanceOf(owner.address))).to.eq(t9)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(t1)

    await network.provider.send("evm_increaseTime", [1 * 60]) // + 1 min
    await network.provider.send("evm_mine")

    await stacking.stake(t1)

    expect((await lptoken.balanceOf(owner.address))).to.eq(t8)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(t2)

    await stacking.unstake()

    expect((await lptoken.balanceOf(owner.address))).to.eq(t8)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(t2)

    await network.provider.send("evm_increaseTime", [19 * 60 + 1]) // + 19 min (total +20 min)
    await network.provider.send("evm_mine")

    await stacking.unstake()

    expect((await lptoken.balanceOf(owner.address))).to.eq(t9)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(t1)

    await network.provider.send("evm_increaseTime", [1 * 60 + 1]) // + 1 min (total +21 min)
    await network.provider.send("evm_mine")

    await stacking.unstake()

    expect((await lptoken.balanceOf(owner.address))).to.eq(t10)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(0)
  })

  it('unstake long interval', async () => {
    expect((await lptoken.balanceOf(owner.address))).to.eq(t10)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(0)

    await stacking.stake(t1)
    await stacking.stake(t1)

    expect((await lptoken.balanceOf(owner.address))).to.eq(t8)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(t2)

    await network.provider.send("evm_increaseTime", [30 * 60]) // + 30 min
    await network.provider.send("evm_mine")

    await stacking.unstake()

    expect((await lptoken.balanceOf(owner.address))).to.eq(t10)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(0)

    await stacking.unstake()

    expect((await lptoken.balanceOf(owner.address))).to.eq(t10)
    expect((await lptoken.balanceOf(stacking.address))).to.eq(0)
  })

})
