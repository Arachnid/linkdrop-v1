pragma solidity >=0.6.0 <0.8.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {

    // =================================================================================================================
    //                                         NFT Mock
    // =================================================================================================================

    // Mint 10 NFTs to deployer
  constructor() public ERC721 ("Mock NFT", "MOCK") {
        for (uint i = 0; i < 10; i++) {
            super._mint(msg.sender, i);
            super._setTokenURI(i, "https://api.myjson.com/bins/1dhwd6");
        }

        for (uint i = 11; i < 15; i++) {
            super._mint(address(this), i);
            super._setTokenURI(i, "https://api.myjson.com/bins/1dhwd6");
        }
    }
    
    /* function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256); */
}
