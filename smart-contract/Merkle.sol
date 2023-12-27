// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Merkle is Ownable {
    bytes32 public whitelistMerkleRoot; // merkle root for whitelisted addresses

    constructor(bytes32 _whitelistMerkleRoot) {
        whitelistMerkleRoot = _whitelistMerkleRoot;
    }

    /**
     * @dev Allow admin to set the new whitelist merkle root if the whitelist changed
     * @param _whitelistMerkleRoot The new whitelist merle root to be set
     */
    function setWhitelistMerkleRoot(
        bytes32 _whitelistMerkleRoot
    ) public onlyOwner {
        whitelistMerkleRoot = _whitelistMerkleRoot;
    }

    /**
     * @dev The function that need to verify whitelist
     * @param _merkleProof MerkleProof for the address in whitelist
     */
    function needToVerifyWhitelist(
        bytes32[] calldata _merkleProof
    ) public payable {
        bytes32 leaf = keccak256(
            bytes.concat(keccak256(abi.encode(_msgSender())))
        );
        require(
            MerkleProof.verify(_merkleProof, whitelistMerkleRoot, leaf),
            "Address is not in whitelist!"
        );

        /*  ******************* */
        /*  DO YOUR STUFF HERE  */
        /*  ******************* */
    }
}
