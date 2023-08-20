const { expect } = require("chai");
const { ethers } = require("hardhat");

async function latestTime() {
  const block = await ethers.provider.getBlock("latest");
  return block.timestamp;
}

const duration = {
  second(val) {
    return val;
  },
  minutes(val) {
    return val * this.seconds(60);
  },
  hours(val) {
    return val * this.minutes(60);
  },
  days(val) {
    return (val = this.hours(24));
  },
  weeks(val) {
    return (val = this.days(7));
  },
  years(val) {
    return (val = this.days(365));
  },
};

describe("NTDuongCrowdSale", () => {
  it("Should have 70% of NTDuong tokens", async () => {
    const NTDuongToken = await ethers.getContractFactory("NTDuong");
    const ntduong = await NTDuongToken.deploy();
    await ntduong.waitForDeployment();

    expect(await ntduong.name()).to.equal("NTDuong");
    expect(await ntduong.symbol()).to.equal("NTD");
    expect(await ntduong.decimals()).to.equal(18);
    const totalSupply = await ntduong.totalSupply();
    expect(totalSupply).to.equal(
      ethers.BigNumber.from("1000000000000000000000000")
    );
    const owner = await ntduong.owner();

    const latestBlockTime = await latestTime();
    const openingTime = latestBlockTime + duration.minutes(1);
    const closeTime = openingTime + duration.weeks(1); // 1 week

    const NTDuongCrowdsale = await ethers.getContractFactory(
      "NTDuongCrowdsale"
    );
    const rate = 500; // 500 wei per token
    const ntduongCrowdsale = await NTDuongCrowdsale.deploy(
      rate,
      owner,
      ntduong.address,
      owner,
      openingTime,
      closeTime
    );

    await ntduongCrowdsale.waitForDeployment();

    await ntduong.approve(
      ntduongCrowdsale.address,
      totalSupply.mul(ethers.BigNumber.from(70)).div(ethers.BigNumber.from(100))
    );

    expect(await ntduongCrowdsale.rate()).to.equal(rate);
    expect(await ntduongCrowdsale.remainingTokens()).to.equal(
      ethers.BigNumber.from("700000000000000000000000")
    );
  });
});
