// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

contract CrowdFunding {
    struct Campaign {
         address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators; // track of address od donaters
        uint256[] donations;// track of how much money thy donated
    }

    // campaigns[0] - we can use like this js bt in solidity we neeed to create mapping to access
     mapping(uint256 => Campaign) public campaigns;
     uint256 public numberOfCampaigns = 0; //keep tract of no of campaign

    function createCampaign(address _owner, string memory _title, string memory _description, uint256 _target, uint256 _deadline, string memory _image) public returns (uint256) //here returns uint coz once we create we need to return its ID
    {
        //creating new campaign  
        // campaign//name of new Campaign
        Campaign storage campaign = campaigns[numberOfCampaigns];
             //block.timestamp is current time.
        require(campaign.deadline < block.timestamp, "The deadline should be a date in the future.");

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;

        numberOfCampaigns++;

        return numberOfCampaigns - 1;
    }

    function donateToCampaign(uint256 _id) public payable {
        uint256 amount = msg.value;

        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent,) = payable(campaign.owner).call{value: amount}("");

        if(sent) {
            campaign.amountCollected = campaign.amountCollected + amount;
        }
    }

    function getDonators(uint256 _id) view public returns (address[] memory, uint256[] memory) {
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        //new variable called allCampaigns which is of type Campagin array of multiple campaign
        //returns the array of struct
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);

        for(uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];

            allCampaigns[i] = item;
        }

        return allCampaigns; 
    }
}
