pragma solidity ^0.5.4;

import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../contracts/ERC1155/ERC1155MixedFungibleMintable.sol";
/* import "../contracts/ERC1155/ERC1155.sol"; */
/* import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol"; */

contract Gallery is Ownable, ERC1155MixedFungibleMintable{
    using SafeMath for uint256;

   mapping (address => bool) public tokenProvided;
   uint tokenCount;

   event SaleRequest(address _from, address indexed _owner, uint indexed _id);


   /**
    //* @dev Function to create and mint original token to the contracnt
    */
  function createAndMint() public onlyOwner() returns (uint){
      createToken();
      return mintToken();
  }

  function returnBalance() public view returns (uint) {
      uint tokenType = uint(1) << 128;
      return this.balanceOf(msg.sender, tokenType);
  }

  /**
//* @dev Function to iniiate pictures
*/
  function initiatePictures() onlyOwner() public {
      string memory uri1 = "{\"title\": \"token1\", \"image\": \"../images/1.jpg\", \"value\": \"2\"}";
      string memory uri2 = "{\"title\": \"token2\", \"image\": \"../images/2.jpg\", \"value\": \"3\"}";
      string memory uri3 = "{\"title\": \"token3\", \"image\": \"../images/3.jpg\", \"value\": \"4\"}";
      uint type1 = this.create(uri1, true);
      uint type2 = this.create(uri2, true);
      uint type3 = this.create(uri3, true);
      address[] memory _address = new address[](1);
      _address[0] = msg.sender;
      this.mintNonFungible(type1, _address);
      this.mintNonFungible(type2, _address);
      this.mintNonFungible(type3, _address);
  }



  /**
   //* @dev Function to get all pictures
   */
  function getPictures() public view returns (uint[] memory){
      if (nonce != 0){
          uint[] memory nfTokens = new uint[](nonce);
          for (uint i = 2; i <= nonce; i++){
              nfTokens[i-2] = i << 128;
              nfTokens[i-2] = nfTokens[i-2] | TYPE_NF_BIT;
          }
          return nfTokens;
      }else{
          uint[] memory nfTokens = new uint[](1);
          nfTokens[0] = 10;
          return nfTokens;
      }

  }

  function getOwnedPictures(uint[] memory _nfTokens) public view returns (address[] memory){
     address[] memory owners = new address[](_nfTokens.length);
     for (uint i= 0; i<_nfTokens.length; i++){
         uint tokenId = (_nfTokens[i] | 1);
         owners[i] = ownerOf(tokenId);
     }
     return owners;
  }

  /**
   //* @dev Function to create fungible token
   */
   function createToken() private {
       this.create("", false);
   }

   /**
    //* @dev Function to mint fungible token to the contract
    */
   function mintToken() private returns (uint) {
        uint tokenType = uint(1) << 128;
        address[] memory toAddresses = new address[](1);
        toAddresses[0] = creators[tokenType];

        uint[] memory amount = new uint[](1);
        amount[0] = 1000;

        // mint new token and the owner gets 1000tokens
        this.mintFungible(tokenType, toAddresses, amount);
   }

   /**
    //* @dev Function to notify the token owner that someone wants to get the token
    */
   function notify(uint _id) external {
       uint tokenId = (_id << 128);
       tokenId = tokenId | TYPE_NF_BIT;
       uint tokenIdForOwn = tokenId | uint(1);
       require(isNonFungible(tokenId));
       require(ownerOf(tokenId) != msg.sender);
       emit SaleRequest(msg.sender, ownerOf(tokenIdForOwn), tokenId);
   }

   function getBlockNum(address _owner, uint _id) public view returns (uint) {
       uint id = _id | 1;
       return blockNum[_owner][id];
   }



   /**
    //* @dev Function to get 10 tokens from the contract. Each id can get only one time.
    */
   function getArt() external {
       uint id = 1;
       uint tokenType = id << 128;
       address owner = creators[tokenType];

       require(!tokenProvided[msg.sender]);
       require(balances[tokenType][owner] >= 10);

       balances[tokenType][owner] = balances[tokenType][owner].sub(10);
       balances[tokenType][msg.sender] = balances[tokenType][msg.sender].add(10);
       tokenProvided[msg.sender] = true;
   }

   //
   // for test use
   //




   /* event Creators(address creator, address creatorOne);
   event ReturnBalance(uint balance, string sign); */


  /* function createAndMint() public onlyOwner() returns (uint){
      createToken();
      return mintToken();
  } */

  /* function returnBalance() public {
    uint tokenId = uint(1) << 128;
    uint _balance = balances[tokenId][creators[tokenId]];
    string memory _sign = "koregabalance";
    emit ReturnBalance(_balance, _sign);
  } */


   /* function createToken() private {
       uint tokenType = this.create("", false);
       uint typeOne = uint(1) << 128;
       emit Creators(creators[tokenType], creators[typeOne]);
   }

   function mintToken() private returns (uint) {
        uint tokenType = uint(1) << 128;
        address[] memory toAddresses = new address[](1);
        toAddresses[0] = creators[tokenType];

        uint[] memory amount = new uint[](1);
        amount[0] = 1000;

        // mint new token and the owner gets 1000tokens
        this.mintFungible(tokenType, toAddresses, amount);
        uint balance = balances[tokenType][creators[tokenType]];
        return balance;

   } */

}
