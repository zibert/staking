import { ethers, waffle } from 'hardhat'
import chai from 'chai'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import ZcoinArtifacts from '../artifacts/contracts/token/Zcoin.sol/Zcoin.json'
import { Zcoin } from '../src/types/Zcoin'


const { deployContract } = waffle
const { expect } = chai

describe('Zcoin', () => {
  let zcoin: Zcoin
  let signers: SignerWithAddress[]
  let owner: SignerWithAddress;
  let acc1: SignerWithAddress;
  let acc2: SignerWithAddress;
  let acc3: SignerWithAddress;
  

  beforeEach(async () => {
    signers = await ethers.getSigners()
    owner = signers[0];
    acc1 = signers[1];
    acc2 = signers[2];
    acc3 = signers[3];
    zcoin = (await deployContract(signers[0], ZcoinArtifacts)) as Zcoin
  })

  describe('zcoin function', async () => {
    it('symbol is correct', async () => {
      let symbol = await zcoin.symbol();
      expect(symbol).to.eq("ZCOIN")
    })

    it('name is correct', async () => {
      let name = await zcoin.name();
      expect(name).to.eq("SUPER ERC20 TOKEN")
    })

    it('name is correct', async () => {
      let decimals = await zcoin.decimals();
      expect(decimals).to.eq(18)
    })

    it('initial total is correct', async () => {
      let total = await zcoin.totalSupply();
      expect(total).to.eq(0)
    })

    it('initial balance is correct', async () => {
      let balance = await zcoin.balanceOf(owner.address);
      expect(balance).to.eq(0);

      balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(0);
    })

    it('mint  is correct', async () => {
      await expect(zcoin.connect(acc1).mint(acc1.address, 42)).to.be.revertedWith(
        "Not owner"
      );

      await zcoin.mint(acc1.address, 42)

      let balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(42);
    })

    it('burn  is correct', async () => {
      await expect(zcoin.connect(acc1).mint(acc1.address, 42)).to.be.revertedWith(
        "Not owner"
      );

      await zcoin.mint(acc1.address, 42)

      let balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(42);

      await expect(zcoin.burn(acc1.address, 43)).to.be.revertedWith(
        "account balance does not have enough tokens to burn"
      );

      await zcoin.burn(acc1.address, 41)

      balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(1);
    })

    it('transfer  is correct', async () => {
      await expect(zcoin.connect(acc1).transfer(acc2.address, 1)).to.be.revertedWith(
        "account does not have enough tokens"
      );

      await zcoin.mint(acc1.address, 42);
      await zcoin.connect(acc1).transfer(acc2.address, 1);

      let balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(41);
      balance = await zcoin.balanceOf(acc2.address);
      expect(balance).to.eq(1);
    })

    it('allowance is correct', async () => {
      let allowance = await zcoin.allowance(acc1.address, acc2.address);
      expect(allowance).to.eq(0);

      await zcoin.connect(acc1).approve(acc2.address, 42);
      allowance = await zcoin.allowance(acc1.address, acc2.address);
      expect(allowance).to.eq(42);
    })

    it('transferFrom is correct', async () => {
      await expect(zcoin.transferFrom(acc1.address, acc2.address, 42)).to.be.revertedWith(
        "account does not have enough tokens"
      );

      await zcoin.mint(acc1.address, 43);

      let balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(43);
      balance = await zcoin.balanceOf(acc2.address);
      expect(balance).to.eq(0);

      await expect(zcoin.transferFrom(acc1.address, acc2.address, 43)).to.be.revertedWith(
        "transfer of this number of tokens is not allowed"
      );

      await zcoin.connect(acc1).approve(acc2.address, 42);

      await expect(zcoin.transferFrom(acc1.address, acc2.address, 43)).to.be.revertedWith(
        "transfer of this number of tokens is not allowed"
      );

      await zcoin.connect(acc1).approve(acc2.address, 43);
      await zcoin.transferFrom(acc1.address, acc2.address, 43)

      balance = await zcoin.balanceOf(acc1.address);
      expect(balance).to.eq(0);
      balance = await zcoin.balanceOf(acc2.address);
      expect(balance).to.eq(43);

    })
  })

})