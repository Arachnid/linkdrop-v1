pragma solidity >=0.6.0 <0.8.0;

import "./LinkdropCommon.sol";
import "../../interfaces/ILinkdropERC1155.sol";
import "openzeppelin-solidity/contracts/token/ERC1155/IERC1155.sol";

contract LinkdropERC1155 is ILinkdropERC1155, LinkdropCommon {
    using SafeMath for uint;
    /**
    * @dev Function to verify linkdrop signer's signature
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _tokenAmount Token amount to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _signature ECDSA signature of linkdrop signer
    * @return True if signed with linkdrop signer's private key
    */
    function verifyLinkdropSignerSignatureERC1155
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes memory _signature
    )
    public view
    override       
    returns (bool)
    {
        bytes32 prefixedHash = ECDSA.toEthSignedMessageHash
        (
            keccak256
            (
                abi.encodePacked
                (
                    _weiAmount,
                    _nftAddress,
                    _tokenId,
                    _tokenAmount,
                    _expiration,
                    version,
                    chainId,
                    _linkId,
                    address(this)
                )
            )
        );
        address signer = ECDSA.recover(prefixedHash, _signature);
        return isLinkdropSigner[signer];
    }


    /**
    * @dev Function to verify claim params and make sure the link is not claimed or canceled
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _tokenAmount Token amount to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function checkClaimParamsERC1155
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes memory _linkdropSignerSignature,
        address _receiver,
        bytes memory _receiverSignature
    )
    public view
    override       
    whenNotPaused
    returns (bool)
    {
        // Make sure nft address is not equal to address(0)
        require(_nftAddress != address(0), "INVALID_NFT_ADDRESS");

        // Make sure link is not claimed
        require(isClaimedLink(_linkId) == false, "LINK_CLAIMED");

        // Make sure link is not canceled
        require(isCanceledLink(_linkId) == false, "LINK_CANCELED");

        // Make sure link is not expired
        require(_expiration >= now, "LINK_EXPIRED");

        // Make sure eth amount is available for this contract
        require(address(this).balance >= _weiAmount, "INSUFFICIENT_ETHERS");

        // Make sure linkdrop master has enough tokens of corresponding tokenId
        require(IERC1155(_nftAddress).balanceOf(linkdropMaster, _tokenId) >= _tokenAmount, "LINKDROP_MASTER_DOES_NOT_HAVE_ENOUGH_TOKENS");

        // Verify that link key is legit and signed by linkdrop signer's private key
        require
        (
            verifyLinkdropSignerSignatureERC1155
            (
                _weiAmount,
                _nftAddress,
                _tokenId,
                _tokenAmount,
                _expiration,
                _linkId,
                _linkdropSignerSignature
            ),
            "INVALID_LINKDROP_SIGNER_SIGNATURE"
        );

        // Verify that receiver address is signed by ephemeral key assigned to claim link (link key)
        require
        (
            verifyReceiverSignature(_linkId, _receiver, _receiverSignature),
            "INVALID_RECEIVER_SIGNATURE"
        );

        return true;
    }

    /**
    * @dev Function to claim ETH and/or ERC1155 token. Can only be called when contract is not paused
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId Token id to be claimed
    * @param _tokenAmount Token amount to be claimed
    * @param _expiration Unix timestamp of link expiration time
    * @param _linkId Address corresponding to link key
    * @param _linkdropSignerSignature ECDSA signature of linkdrop signer
    * @param _receiver Address of linkdrop receiver
    * @param _receiverSignature ECDSA signature of linkdrop receiver
    * @return True if success
    */
    function claimERC1155
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _tokenAmount,
        uint _expiration,
        address _linkId,
        bytes calldata _linkdropSignerSignature,
        address payable _receiver,
        bytes calldata _receiverSignature
    )
    external
    override 
    whenNotPaused
    returns (bool)
    {

        // Make sure params are valid
        require
        (
            checkClaimParamsERC1155
            (
                _weiAmount,
                _nftAddress,
                _tokenId,
                _tokenAmount,
                _expiration,                
                _linkId,
                _linkdropSignerSignature,
                _receiver,
                _receiverSignature
            ),
            "INVALID_CLAIM_PARAMS"
        );

        // Mark link as claimed
        claimedTo[_linkId] = _receiver;

        // Make sure transfer succeeds
        require(_transferFundsERC1155(_weiAmount, _nftAddress, _tokenId, _tokenAmount, _receiver), "TRANSFER_FAILED");

        // Log claim
        emit ClaimedERC1155(_linkId, _weiAmount, _nftAddress, _tokenId, _tokenAmount, _receiver);

        return true;
    }

    /**
    * @dev Internal function to transfer ethers and/or ERC1155 tokens
    * @param _weiAmount Amount of wei to be claimed
    * @param _nftAddress NFT address
    * @param _tokenId token id to transfer
    * @param _tokenAmount Token amount to transfer
    * @param _receiver Address to transfer funds to
    * @return True if success
    */
    function _transferFundsERC1155
    (
        uint _weiAmount,
        address _nftAddress,
        uint _tokenId,
        uint _tokenAmount,
        address payable _receiver
    )
    internal returns (bool) {      
      // Transfer ethers
      if (_weiAmount > 0) {
        _receiver.transfer(_weiAmount);
      }
      
      // Transfer NFT
      IERC1155(_nftAddress).safeTransferFrom(linkdropMaster, _receiver, _tokenId, _tokenAmount, new bytes(0));
      
      return true;
    }

}
