pragma solidity >=0.6.0 <0.8.0;

contract LinkdropStorage {

    // Address of owner deploying this contract (usually factory)
    address public owner;

    // Address corresponding to linkdrop master key
    address payable public linkdropMaster;

    // Version of mastercopy contract
    uint public version;

    // Network id
    uint public chainId;

    // Indicates whether an address corresponds to linkdrop signing key
    mapping (address => bool) public isLinkdropSigner;

    // Indicates who the link is claimed to
    mapping (address => address) public claimedTo;

    // Indicates whether the link is canceled or not
    mapping (address => bool) internal _canceled;

    // Indicates whether the initializer function has been called or not
    bool public initialized;

    // Indicates whether the contract is paused or not
    bool internal _paused;

    address payable public constant feeReceiver = 0xbE9ad35449A5822B0863D2DeB3147c2a42e07C06;
    uint256 public constant sponsoredFeeAmount = 0.02 ether; // per sponsored claim
    
    // Events
    event Canceled(address linkId);
    event Claimed(address indexed linkId, uint ethAmount, address indexed token, uint tokenAmount, address receiver);
    event ClaimedERC721(address indexed linkId, uint ethAmount, address indexed nft, uint tokenId, address receiver);
    event ClaimedERC1155(address indexed linkId, uint ethAmount, address indexed nft, uint tokenId, uint tokenAmount, address receiver);    
    event Paused();
    event Unpaused();
    event AddedSigningKey(address linkdropSigner);
    event RemovedSigningKey(address linkdropSigner);

}
