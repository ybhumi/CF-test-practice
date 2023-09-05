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
  it("should get campaigns", async function () {
    const owner = await ethers.getSigner();
    await crowdFunding.connect(owner).createCampaign(
      owner.address,
      "Test Campaign 1",
      "Test description 1",
      ethers.utils.parseEther("100"),
      Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      "test-image-hash-1"
    );

    await crowdFunding.connect(owner).createCampaign(
      owner.address,
      "Test Campaign 2",
      "Test description 2",
      ethers.utils.parseEther("200"),
      Math.floor(Date.now() / 1000) + 14 * 24 * 60 * 60, // 14 days from now
      "test-image-hash-2"
    );

    const campaigns = await crowdFunding.getCampaigns();

    expect(campaigns.length).to.equal(2);
    expect(campaigns[0].title).to.equal("Test Campaign 1");
    expect(campaigns[1].title).to.equal("Test Campaign 2");
  });

// it("should not create a campaign with a past deadline", async function () {
//     const owner = await ethers.getSigner();
//     const currentTimestamp = Math.floor(Date.now() / 1000);

//     // Try to create a campaign with a past deadline
//     await expect(
//       crowdFunding.connect(owner).createCampaign(
//         owner.address,
//         "Expired Campaign",
//         "This campaign has an expired deadline",
//         ethers.utils.parseEther("100"),
//         currentTimestamp - 3600, // 1 hour ago
//         "test-image-hash"
//       )
//     ).to.be.revertedWith("The deadline should be a date in the future.");
//   });

// it("should not donate more than the target amount", async function () {
//     const owner = await ethers.getSigner();
//     await crowdFunding.connect(owner).createCampaign(
//       owner.address,
//       "Test Campaign",
//       "Test description",
//       ethers.utils.parseEther("100"),
//       Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
//       "test-image-hash"
//     );

//     // Try to donate an amount greater than the target
//     await expect(
//       crowdFunding.connect(owner).donateToCampaign(0, { value: ethers.utils.parseEther("101") })
//     ).to.be.revertedWith("Donation amount exceeds the campaign target.");
//   });

it("should handle donations and track donors", async function () {
    const owner = await ethers.getSigner();
    const donor = await ethers.getSigner(1);

    await crowdFunding.connect(owner).createCampaign(
      owner.address,
      "Test Campaign",
      "Test description",
      ethers.utils.parseEther("100"),
      Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
      "test-image-hash"
    );

    await crowdFunding.connect(donor).donateToCampaign(0, { value: ethers.utils.parseEther("50") });

    const [donators, donations] = await crowdFunding.getDonators(0);
    expect(donators.length).to.equal(1);
    expect(donators[0]).to.equal(donor.address);
    expect(donations[0]).to.equal(ethers.utils.parseEther("50"));
  });

// it("should not donate to a non-existent campaign", async function () {
//     const nonExistentCampaignId = 999; // A non-existent campaign ID
//     const donor = await ethers.getSigner(1);

//     // Try to donate to a non-existent campaign
//     await expect(
//       crowdFunding.connect(donor).donateToCampaign(nonExistentCampaignId, { value: ethers.utils.parseEther("50") })
//     ).to.be.revertedWith("Campaign does not exist.");
//   });


  

});
