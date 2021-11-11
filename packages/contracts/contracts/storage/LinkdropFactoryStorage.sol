pragma solidity >=0.6.0 <0.8.0;
import "openzeppelin-solidity/contracts/access/Ownable.sol";

contract LinkdropFactoryStorage is Ownable {

    // Current version of mastercopy contract
    uint public masterCopyVersion;

    // Contract bytecode to be installed when deploying proxy
    bytes internal _bytecode;

    // Bootstrap initcode to fetch the actual contract bytecode. Used to generate repeatable contract addresses
    bytes internal _initcode;

    // Network id
    uint public chainId;

    // Maps hash(sender address, campaign id) to its corresponding proxy address
    mapping (bytes32 => address) public deployed;

    // Events
    event Deployed(address payable indexed owner, uint campaignId, address payable proxy, bytes32 salt);
    event Destroyed(address payable owner, address payable proxy);
    event SetMasterCopy(address masterCopy, uint version);

}
