App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return await App.initWeb3();
  },

  initWeb3: async function() {
      // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    App.web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/69c812a113224017b9f3d3357c7aa8c4');
    // App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/69c812a113224017b9f3d3357c7aa8c4');
  }

  web3 = new Web3(App.web3Provider);
  return App.initContract();
  },

  initContract: function() {
      $.getJSON('Gallery.json', function(data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var GalleryArtifact = data;
    App.contracts.Gallery = TruffleContract(GalleryArtifact);

    // Set the provider for our contract
    App.contracts.Gallery.setProvider(App.web3Provider);

    // Use our contract to retrieve and mark the adopted pets
    App.showNFTokens();
    return App.showOwnedTokenAmount();
  });
    return App.createAndMint();
  },

//
// mint token
//
 createAndMint: function(){
     $(document).on('click','#startButton', function(event){
         event.preventDefault();
         let galleryInstance;

         App.contracts.Gallery.deployed().then(instance => {
             galleryInstance = instance;
             galleryInstance.createAndMint();
         }).catch(function(err) {
             console.log(err.message)
         });
     })
 },

 getArt: function(){
     $(document).off('click');
     $(document).on('click','#getArt', function(event){
         event.preventDefault();
         let galleryInstance;
         App.contracts.Gallery.deployed().then(instance => {
             galleryInstance = instance;
             return galleryInstance.getArt();
         }).then(result => {
             App.showNFTokens();
             App.showOwnedTokenAmount();
         }).catch(function(err) {
                 console.log(err.message)
             });
     });
 },

 registerPic: function(){
     $(document).off('click');
     $(document).on('click','#registerPic', function(event){
         event.preventDefault();
         let galleryInstance;

          App.contracts.Gallery.deployed().then(instance => {
              instance.initiatePictures();
          });


     });
 },
 // registerPic: function(){
 //     $(document).off('click');
 //     $(document).on('click','#registerPic', function(event){
 //         event.preventDefault();
 //         let galleryInstance;
 //         let accout;
 //
 //         web3.eth.getAccounts((error, accounts) => {
 //             account = accounts[0]
 //             App.contracts.Gallery.deployed().then(instance => {
 //                 galleryInstance = instance;
 //                 let uri = '{"title": "token1", "image": "../images/1.jpg"}';
 //                 return galleryInstance.create(uri, true);
 //             }).then(tokenType => {
 //                 galleryInstance.mintNonFungible(tokenType, account);
 //             }).then(result => {
 //                 let uri = '{"title": "token2", "image": "../images/2.jpg"}';
 //                 return galleryInstance.create(uri, true);
 //             }).then(tokenType => {
 //                 galleryInstance.mintNonFungible(tokenType, account);
 //             }).then(result => {
 //                 let uri = '{"title": "token3", "image": "../images/3.jpg"}';
 //                 return galleryInstance.create(uri, true);
 //             }).then(tokenType => {
 //                 galleryInstance.mintNonFungible(tokenType, account);
 //             }).catch(function(err) {
 //                 console.log(err.message)
 //             });
 //         });
 //
 //     });
 // },
 // registerPic1: function(){
 //     $(document).off('click');
 //     $(document).on('click','#registerPic1', function(event){
 //         event.preventDefault();
 //         let galleryInstance;
 //         let accout;
 //
 //         web3.eth.getAccounts((error, accounts) => {
 //             account = accounts[0]
 //             App.contracts.Gallery.deployed().then(instance => {
 //                 galleryInstance = instance;
 //                 let uri = '{"title": "token1", "image": "../images/1.jpg"}';
 //                 return galleryInstance.create(uri, true);
 //             }).then(tokenType => {
 //                 galleryInstance.mintNonFungible(tokenType, account);
 //             }).catch(function(err) {
 //                 console.log(err.message)
 //             });
 //         });
 //
 //     });
 // },

 showOwnedTokenAmount: function(){
     let galleryInstance;
     App.contracts.Gallery.deployed().then(instance => {
         galleryInstance = instance;
         return galleryInstance.returnBalance();
     }).then(result => {
         $("#ownedArt").text(result);
     }).catch(function(err) {
             console.log(err.message);
     });
 },

 showNFTokens: function(){
     let galleryInstance;
     App.contracts.Gallery.deployed().then(instance => {
         galleryInstance = instance;
         return galleryInstance.getPictures();
     }).then(pictures => {
         console.log(pictures);

         for (var i=0; i<pictures.length; i++){
             var uriEvent = galleryInstance.URI({_id: pictures[i]}, {fromBlock:1, toBlock:"latest"});
             uriEvent.watch((error, result) => {
                 let obj = $.parseJSON(result.args._value);
                 $("#ownedArt").html("<img src='" + obj.image + "'>");
                 console.log(result.args._value);
             });
         }
     })
 }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
