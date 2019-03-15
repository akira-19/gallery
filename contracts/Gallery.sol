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
    * @dev Function to create and mint original token to the contracnt
    */
  function createAndMint() public onlyOwner() returns (uint){
      createToken();
      return mintToken();
  }


  /**
* @dev Function to iniiate pictures(NFT)
*/
  function initiatePictures() onlyOwner() public{
      string memory uri1 = "{\"title\": \"token1\", \"image\": \"../images/1.jpg\"}";
      string memory uri2 = "{\"title\": \"token2\", \"image\": \"../images/2.jpg\"}";
      string memory uri3 = "{\"title\": \"token3\", \"image\": \"../images/3.jpg\"}";
      uint type1 = this.create(uri1, true);
      uint type2 = this.create(uri2, true);
      uint type3 = this.create(uri3, true);
      address[] memory msgSender = new address[](1);
      msgSender[0] = msg.sender;
      this.mintNonFungible(type1, msgSender);
      this.mintNonFungible(type2, msgSender);
      this.mintNonFungible(type3, msgSender);
  }

  /**
   * @dev Function to get all pictures(NFT)
   * @return An array of NFTs' id
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

  /**
   * @dev Function to create fungible token
   */
   function createToken() private {
       this.create("", false);
   }

   /**
    * @dev Function to mint fungible token to the contract
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
    * @dev Function to notify the token owner that someone wants to get the token
    * @param NFT id
    */
   function notify(uint _id) external {
       require(isNonFungible(_id));
       require(nfOwners[_id] != msg.sender);
       emit SaleRequest(msg.sender, nfOwners[_id], _id);
   }

   /**
    * @dev Function to get 10 tokens from the contract. Each id can get only one time.
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


   /* function returnBalance() public view returns (uint) {
       uint tokenType = uint(1) << 128;
       return this.balanceOf(msg.sender, tokenType);
   } */

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
