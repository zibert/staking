import { ethers, waffle } from 'hardhat'
import chai from 'chai'

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address"

import ZcoinArtifacts from '../artifacts/contracts/token/Zcoin.sol/Zcoin.json'
import { Zcoin } from '../src/types/Zcoin'

import IUniswapV2FactoryArtifacts from '../artifacts/contracts/uniswap/IUniswapV2Factory.sol/IUniswapV2Factory.json'
import { IUniswapV2Factory } from '../src/types/IUniswapV2Factory'

import IUniswapV2PairArtifacts from '../artifacts/contracts/uniswap/IUniswapV2Pair.sol/IUniswapV2Pair.json'
import { IUniswapV2Pair } from '../src/types/IUniswapV2Pair'

import IUniswapV2Router02Artifacts from '../artifacts/contracts/uniswap/IUniswapV2Router02.sol/IUniswapV2Router02.json'
import { IUniswapV2Router02 } from '../src/types/IUniswapV2Router02'

const { deployContract } = waffle
const { expect } = chai

const uniswapV2Router02address = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

describe('Uniswap', () => {
    let zcoin: Zcoin;
    let signers: SignerWithAddress[]
    let owner: SignerWithAddress;
    let acc1: SignerWithAddress;
    let acc2: SignerWithAddress;
    let acc3: SignerWithAddress;
    let uniswapV2Factory: IUniswapV2Factory;
    let uniswapV2Pair: IUniswapV2Pair;
    let uniswapV2Router02: IUniswapV2Router02;

    const t100 = ethers.utils.parseEther("100.0");
    const t75 = ethers.utils.parseEther("75.0");
    const t10 = ethers.utils.parseEther("10");
    const t20 = ethers.utils.parseEther("20");

    beforeEach(async () => {
        signers = await ethers.getSigners();

        owner = signers[0];
        acc1 = signers[1];
        acc2 = signers[2];
        acc3 = signers[3];

        zcoin = (await deployContract(signers[0], ZcoinArtifacts)) as Zcoin
        await zcoin.mint(owner.address, t100);
    })

    it('uniswap connet is correct', async () => {
        let provider = await ethers.getDefaultProvider();

        uniswapV2Router02 =
            new ethers.Contract(uniswapV2Router02address, IUniswapV2Router02Artifacts.abi, owner) as IUniswapV2Router02;

        let factoryAddress = await uniswapV2Router02.factory();
        let wethAddress = await uniswapV2Router02.WETH();

        uniswapV2Factory = new ethers.Contract(factoryAddress, IUniswapV2FactoryArtifacts.abi, owner) as IUniswapV2Factory;

        await uniswapV2Factory.createPair(zcoin.address, wethAddress);

        let poolAdresse = await uniswapV2Factory.getPair(zcoin.address, wethAddress);
        await zcoin.approve(poolAdresse, t75);

        const options = {
            value: t10,
            gasLimit: 5000000
        }

        let lastblock = await provider.getBlock(provider._lastBlockNumber);

        await uniswapV2Router02.addLiquidityETH(
            zcoin.address,
            t20,
            t10,
            t20,
            owner.address,
            lastblock.timestamp + 3600,
            options);

        uniswapV2Pair =
            new ethers.Contract(poolAdresse, IUniswapV2PairArtifacts.abi, owner) as IUniswapV2Pair;

        let lpBalance1 = await uniswapV2Pair.balanceOf(owner.address);
        expect(lpBalance1.gt(0)).to.eq(true)
    })
})
