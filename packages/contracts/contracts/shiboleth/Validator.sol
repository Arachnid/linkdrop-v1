//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";


interface IValidator {
  function claim(address beneficiary, bytes calldata data, bytes calldata authsig, bytes calldata claimsig) external;
  /* function checkData(address beneficiary, bytes calldata data) internal; */
  /* function takeClaimAction(address beneficiary, bytes calldata data) internal; */
}


contract Validator is IValidator {
    mapping(address=>bool) issuers;
    
    function claim(address beneficiary, bytes calldata data, bytes calldata authsig, bytes calldata claimsig) external override {
      require(1 == 2, "in Validator claim");
        bytes32 claimhash = keccak256(abi.encodePacked(
            hex"1900",
            address(this),
            byte(0x80),
            keccak256(authsig),
            beneficiary
        ));
        address claimant = ECDSA.recover(claimhash, claimsig);
        bytes32 authhash = keccak256(abi.encodePacked(
            hex"1900",
            address(this),
            byte(0x00),
            keccak256(data),
            claimant
        ));
        address issuer = ECDSA.recover(authhash, authsig);
        require(issuers[issuer]);
        // Conduct checks on `data` here, and take action if they pass.


    }
}
