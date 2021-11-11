pragma solidity >=0.6.0 <0.8.0;

import "openzeppelin-solidity/contracts/token/ERC1155/ERC1155.sol";

contract ERC1155Mock is ERC1155 {

    // =================================================================================================================
    //                                         NFT Mock
    // =================================================================================================================

    // Mint 10 NFTs to deployer
  constructor() public ERC1155("http://test-string.linkdrop.io") {
        for (uint i = 0; i < 10; i++) {
          super._mint(msg.sender, i, 1, new bytes(0));
        }

        /* for (uint i = 11; i < 15; i++) { */
        /*   super._mint(address(this), i, 1, 0x0); */
        /* } */
    }
    
    /* function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256); */
}
