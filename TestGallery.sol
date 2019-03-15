pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Gallery.sol";

contract TestGallery {
    Gallery gallery = Gallery(DeployedAddresses.Gallery());

    function testConstructor() public{
        gallery.construction();
        uint _id = uint(1) << 128;
        Assert.equal(gallery.balanceOf(msg.sender, _id), 1000, "contact owner should have 1000");
    }

}
