pragma solidity ^0.5.0;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../contracts/ERC1155/ERC1155MixedFungibleMintable.sol";
/* import "../contracts/ERC1155/ERC1155.sol"; */
/* import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol"; */

contract Gallery is Ownable, ERC1155MixedFungibleMintable{
    using SafeMath for uint256;

   mapping (address => bool) public tokenProvided;

   event SaleRequest(address _from, address indexed _owner, uint indexed _id);

   /* constructor() public payable{
       construction();
   } */

   function construction() public {
       // create new fungible token.
       this.create("", false);
       address[] memory toAddresses;
       toAddresses[0] = msg.sender;
       uint[] memory amount;
       amount[0] = 1000;
       uint tokenId;
       tokenId = uint(1) << 128;
       // mint new token and the owner gets 1000tokens
       this.mintFungible(tokenId, toAddresses, amount);
   }

   function notify(uint _id) external {
       require(isNonFungible(_id));
       require(nfOwners[_id] != msg.sender);
       emit SaleRequest(msg.sender, nfOwners[_id], _id);
   }


   function getArt() external{
       uint id = 1;
       uint tokenType = id << 128;
       address owner = owner();
       require(!tokenProvided[msg.sender]);
       require(balances[tokenType][owner] >= 10);
       balances[tokenType][owner] = balances[tokenType][owner].sub(10);
       balances[tokenType][msg.sender]   = balances[tokenType][msg.sender].add(10);
       tokenProvided[msg.sender] = true;
   }

}
