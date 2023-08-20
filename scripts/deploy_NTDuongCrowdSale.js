// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// eslint-disable-next-line import/no-extraneous-dependencies
// const { ethers } = require("ethers");
const { ethers } = require("hardhat");
// const { BigNumber } = require('ethers')

async function latestTime() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

const duration = {
  seconds(val) {
    return val;
  },
  minutes(val) {
    return val * this.seconds(60);
  },
  hours(val) {
    return val * this.minutes(60);
  },
  days(val) {
    return val * this.hours(24);
  },
  weeks(val) {
    return val * this.days(7);
  },
  years(val) {
    return val * this.days(365);
  },
};

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const NTDuong = await ethers.getContractFactory("NTDuong");
  const ntduong = await NTDuong.deploy();
  // const ntduong = await ethers.deployContract('NTDuong');

  await ntduong.waitForDeployment();
  console.log("NTDuong deployed to:", await ntduong.getAddress());
  console.log("Name", await ntduong.name());
  console.log("Symbol", await ntduong.symbol());
  console.log("Decimals", await ntduong.decimals());
  const totalSupply = await ntduong.totalSupply();
  console.log("Total Supply", totalSupply);
  const owner = await ntduong.owner();
  console.log("Owner", owner);

  // deploy crowdsale contract
  const NTDuongCrowdSale = await ethers.getContractFactory("NTDuongCrowdsale");
  const rate = 500; // 500 wei per token
  const latestBlockTime = await latestTime();
  const openingTime = latestBlockTime + duration.minutes(1);
  const closeTime = openingTime + duration.weeks(1); // 1 week
  console.log("openingTime", openingTime);
  console.log("closeTime", closeTime);
  const ntduongCrowdSale = await NTDuongCrowdSale.deploy(
    rate,
    owner,
    ntduong.getAddress(),
    owner,
    openingTime,
    closeTime
  );
  //     const address1 = await ntduong.getAddress();
  //     const ntduongCrowdSale = await ethers.deployContract(
  //     rate,
  //     owner,
  //     // ntduong.address,
  //     address1,
  //     owner,
  //     openingTime,
  //     closeTime
  //   );
  await ntduongCrowdSale.waitForDeployment();
  console.log(
    "NTDuongCrowdsale deployed to:",
    await ntduongCrowdSale.getAddress()
  );

  // approve crowdsale contract to spend 70% tokens
  // await ntduong.approve(
  //   ntduongCrowdSale.getAddress(),
  //   totalSupply.mul(ethers.BigNumber.from(70)).div(ethers.BigNumber.from(100)).toString()
  // );

  const totalSupplyBigInt = BigInt(totalSupply);
  const seventyPercent = (totalSupplyBigInt * BigInt(70)) / BigInt(100);

  await ntduong.approve(
    ntduongCrowdSale.getAddress(),
    seventyPercent.toString()
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
