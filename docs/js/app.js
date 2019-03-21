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
    App.web3Provider = new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/a0e6bae2d4be4f749b0525b8f300a214');
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
    App.showOwnedNFTokens();
    App.showOnlyOwner();
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

 showOnlyOwner: function(){
     web3.eth.getAccounts((error, accounts) => {
        account = accounts[0]
        App.contracts.Gallery.deployed().then(instance => {
            return instance.owner();
        }).then(owner => {
            if (owner == account){
                $("#trWrapper").append("<button  class='btn btn-primary'  id='startButton'>initiate</button><button  class='btn btn-primary'  id='registerPic' onclick='App.registerPic();'>get picture</button>");
            }
        })
    });

 },

 registerPic: function(){
     $(document).off('click');
     $(document).on('click','#registerPic', function(event){
         event.preventDefault();
         let galleryInstance;
         App.contracts.Gallery.deployed().then(instance => {
             galleryInstance = instance;
             instance.initiatePictures();
         }).catch(function(err) {
             console.log(err.message);
         });


    })
},

 buyImage: function(){
     $(document).off('click');
     $(document).on('click','.buyBtn', function(event){
         event.preventDefault();
         let galleryInstance;
         let thisPicId = $(this).val();
          App.contracts.Gallery.deployed().then(instance => {
              thisPicId = parseInt(thisPicId);
              galleryInstance = instance;
              galleryInstance.notify(thisPicId);
          }).catch(function(err) {
              console.log(err.message);
          });


     });
 },


 showOwnedTokenAmount: function(){
     let galleryInstance;
     App.contracts.Gallery.deployed().then(instance => {
         galleryInstance = instance;
         return galleryInstance.returnBalance();
     }).then(result => {
         if (result == 0){
             $("#ownedArt").html("<button  class='btn btn-info'  id='getArt' onclick='App.getArt();'>Get art</button>");
         }else{
             $("#ownedArt").text("Owned art: "+result+" art");
         }

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
         var getImage = (i) => {
             var uriEvent = galleryInstance.URI({_id: pictures[i]}, {fromBlock:1, toBlock:"latest"});
             uriEvent.watch((error, result) => {
                 let objImage = $.parseJSON(result.args._value).image.slice(3);
                 let objTitle = $.parseJSON(result.args._value).title;
                 let objValue = $.parseJSON(result.args._value).value;
                 let objId = result.args._id;
                 $("#img-"+(i+1)).prepend("<img src='" + objImage + "'>");
                 $("#img-"+(i+1)).append("Title: " + objTitle + "<br>");
                 $("#img-"+(i+1)).append("Price: " + objValue + "art");
                 $("#img-"+(i+1)+" button").val(i+2);

             });
         };
        for (var i=0; i<pictures.length; i++){
                 getImage(i);
        }
     }).catch(function(err) {
         console.log(err.message);
     });
 },

 showOwnedNFTokens: function(){
     let galleryInstance;
     let allPictures;
     web3.eth.getAccounts((error, accounts) => {
        account = accounts[0]
        App.contracts.Gallery.deployed().then(instance => {
            galleryInstance = instance;
            return galleryInstance.getPictures();
        }).then(pictures => {
            allPictures = pictures;


            pictures.forEach(id => {
                galleryInstance.getBlockNum(account, id).then(blockNum => {
                    let picUri;
                    getURI(id, blockNum).then(result => {
                        picUri = result;
                        return getReq(id, blockNum);
                    }).then(result => {
                        return sucReq(result, picUri);
                    }).then(arr => {
                        let tableArr = [];
                        arr.forEach(elm=>{
                            let title = elm[0];
                            let fromAd = elm[1];
                            let tokenId = picUri[0].args._id;
                            let tokenIdString = tokenId.toString();
                            if (tableArr.indexOf(fromAd) == (-1)){
                                $("#trWrapper tbody").append("<tr><td>" + title + "</td><td>" + fromAd
                                + "</td><td><button class='btn btn-danger sellBtn' name='" + tokenIdString + "' value='" + fromAd + "' onclick='App.sellPicture()'>Sell</button></td></tr>");
                                tableArr.push(fromAd);
                            }

                        });


                    })



                    function getURI(id, blockNum) {
                        return new Promise((resolve, reject) => {
                            let uriEvent = galleryInstance.URI({_id: id}, {fromBlock:0, toBlock:"latest"});
                            uriEvent.get((error, result) => {
                                resolve(result);
                            })
                        });
                    }

                    function getReq(id, blockNum){
                        return new Promise((resolve, reject) => {

                            let saleRequestEvent = galleryInstance.SaleRequest({_owner: account, _id: id}, {fromBlock: (parseInt(blockNum.toString())+1), toBlock: "latest"});
                                saleRequestEvent.get((error, result) => {
                                    resolve(result);
                                });
                        });
                    }

                    function sucReq(reqs, picUri) {
                        return new Promise( (resolve, reject) => {
                            let tableArr = [];
                            for (var i = 0; i < reqs.length; i++) {
                                    let fromAd = reqs[i].args._from;
                                    let title = $.parseJSON(picUri[0].args._value).title;
                                    if (tableArr.indexOf([title, fromAd]) == -1){
                                        tableArr.push([title, fromAd]);
                                    }



                            }
                            resolve(tableArr);
                        });
                    }





                })
            });

            return galleryInstance.getOwnedPictures(pictures);
        }).then(owner=>{
            let getImage = (i) => {
                if (owner[i] == account){
                    let uriEvent = galleryInstance.URI({_id: allPictures[i]}, {fromBlock:1, toBlock:"latest"});
                    uriEvent.watch((error, result) => {
                        let objImage = $.parseJSON(result.args._value).image.slice(3);
                        let objTitle = $.parseJSON(result.args._value).title;
                        let objId = result.args._id;
                        $("#myImg-"+(i+1)).prepend("<img src='" + objImage + "'>");
                        $("#myImg-"+(i+1)).append("Title: " + objTitle + "<br>");
                    });

                }


            };
           for (var i=0; i<owner.length; i++){
                    getImage(i);
           }

        }).catch(function(err) {
            console.log(err.message);
        });
    });

},

sellPicture: function(){
    const BigNumber = require('bignumber.js');
    $(document).off('click');
    $(document).on('click','.sellBtn', function(event){
        let val = $(this).val();
        let name = $(this).attr('name');
        event.preventDefault();
        web3.eth.getAccounts((error, accounts) => {
            account = accounts[0]
            App.contracts.Gallery.deployed().then(instance => {
                let tokenId = web3.toBigNumber(name);
                instance.safeTransferFrom(account, val, tokenId, 1, 0, {gas:1000000});
            })
        });
    });

}



}

$(function() {
  $(window).load(function() {
    App.init();
  });
});
