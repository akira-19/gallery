var Gallery = artifacts.require("Gallery");
const truffleAssert = require('truffle-assertions');

contract("GalleryTest", function(accounts){
    // it("should make the creator and contract address the same", function(){
    //     var galleryInstance;
    //     return Gallery.new({from: accounts[0]}).then(function(instance){
    //         galleryInstance = instance;
    //         return galleryInstance.createToken();
    //     }).then((result) => {
    //         truffleAssert.eventEmitted(result, 'Creators', (ev) => {
    //             return ev.creator == result.logs[0].address;
    //         }, 'Creator should be contract address');
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // });
    //
    // it("should have 1000 tokens at first", function(){
    //     var galleryInstance;
    //     return Gallery.new({from: accounts[0]}).then(function(instance){
    //         galleryInstance = instance;
    //         return galleryInstance.createToken();
    //     }).then(() => {
    //         return galleryInstance.mintToken();
    //     }).then((result) => {
    //         assert.equal(result.logs[0].args[4], 1000, "the contract should have 1000 token");
    //     }).catch(err => {
    //         console.log(err);
    //     })
    // })

    it("should have NFT", function(){
        let galleryInstance;
        let tokenId;
        return Gallery.new({from: accounts[0]}).then(function(instance){
            galleryInstance = instance;
            galleryInstance.createAndMint();
        }).then(() => {
            let uri = '{"title": "token1", "image": "../images/1.jpg"}';
            return galleryInstance.create(uri, true);
        }).then(tokenType => {
            tokenId = tokenType;
            galleryInstance.mintNonFungible(tokenType, accounts[0]);
        }).then(() => {
            //
            // console.log('korega');
            // console.log(typeof tokenId.logs[0].args[3]);
            // console.log('korega');
            //
            console.log(tokenId.logs[0].args[3]);

            // tokenId = web3.utils.toBN(tokenId.logs[0].args[3]);
            return galleryInstance.balanceOf(accounts[0],tokenId.logs[0].args[3]);
        }).then( balance => {
            // console.log(balance);
        }).catch(err => {
            console.log(err);
        })
    })

});
