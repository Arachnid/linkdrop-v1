pragma solidity >=0.6.0 <0.8.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract ERC20Mock is ERC20 {

    // =================================================================================================================
    //                                         Token Mock
    // =================================================================================================================
    
    // Mint tokens to deployer
    constructor() public ERC20 ("Mock Token", "MOCK") {
        _mint(msg.sender, 10**24);
    }
    
    // Faucet function to get free tokens
    function faucet() external {
        _mint(msg.sender, 10**10);
    }
    
}
