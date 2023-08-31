const { ethers, run, network } = require("hardhat");

async function main() {
  await run("compile"); // Compile the contracts

  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
  const crowdFunding = await CrowdFunding.deploy();

  await crowdFunding.deployed();

  console.log("CrowdFunding deployed to:", crowdFunding.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
