const { expect } = require("chai");

describe("CrowdFunding", function () {
  let crowdFunding;

  beforeEach(async function () {
    const CrowdFundingFactory = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFundingFactory.deploy();
    await crowdFunding.deployed();
  });

  it("should create a campaign", async function () {
    const owner = await ethers.getSigner();
    await crowdFunding.connect(owner).createCampaign(
      owner.address,
      "Test Campaign",
      "Test description",
      ethers.utils.parseEther("100"),
      Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      "test-image-hash"
    );

    expect(await crowdFunding.numberOfCampaigns()).to.equal(1);
    const campaign = await crowdFunding.campaigns(0);
    expect(campaign.owner).to.equal(owner.address);
  });

  it("should donate to a campaign", async function () {
    const owner = await ethers.getSigner();
    await crowdFunding.connect(owner).createCampaign(
      owner.address,
      "Test Campaign",
      "Test description",
      ethers.utils.parseEther("100"),
      Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      "test-image-hash"
    );

    await crowdFunding.connect(owner).donateToCampaign(0, { value: ethers.utils.parseEther("50") });

    const campaign = await crowdFunding.campaigns(0);
    expect(campaign.amountCollected).to.equal(ethers.utils.parseEther("50"));
  });

  it("should get donators' information", async function () {
    const owner = await ethers.getSigner();
    await crowdFunding.connect(owner).createCampaign(
      owner.address,
      "Test Campaign",
      "Test description",
      ethers.utils.parseEther("100"),
      Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      "test-image-hash"
    );

    await crowdFunding.connect(owner).donateToCampaign(0, { value: ethers.utils.parseEther("50") });

    const [donators, donations] = await crowdFunding.getDonators(0);
    expect(donators.length).to.equal(1);
    expect(donations[0]).to.equal(ethers.utils.parseEther("50"));
  });

  

});
