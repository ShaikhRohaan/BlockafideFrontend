// Moralis.initialize("ETw6gLL6BMVcfCtnf3u4FxEZHAxcTDLJoLOZ1liu"); // Application id from moralis.io
// Moralis.serverURL = "https://pwj3xtoswhdc.usemoralis.com:2053/server"; //Server url from moralis.io
// Moralis.authenticate()
// Moralis.start({ serverUrl, appId });
const serverUrl = "https://gjyexdlwsqwi.usemoralis.com:2053/server";
const appId = "zNakMsSAjNQYtzbJnJ9vaKfZRfKtEz2tvjS9FcCZ";
Moralis.start({ serverUrl, appId });

//mint nft address:"https://ipfs.moralis.io:2053/ipfs/QmQfVrKsdynL618xQXCuY9M3VS1vbRL4fnexNfM7RhqgRn"
const nft_contract_address = "0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431" //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
/*
Available deployed contracts
Ethereum Rinkeby 0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431
Polygon Mumbai 0x351bbee7C6E9268A1BF741B098448477E08A0a53
BSC Testnet 0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431
*/

var account = (localStorage.getItem("user"));
if ("user" in localStorage) {
  console.log("login");
  document.getElementById("user_logout").style.display="inline";
  document.getElementById("user_login").style.display="none";
}
 else {
  console.log("not found");
  document.getElementById("user_logout").style.display="none";
  document.getElementById("user_login").style.display="inline";
}
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function () {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-metamask").onclick = connectmeta;
document.getElementById("btn-logout").onclick = logOut

async function logoutac()
{
  localStorage.clear();
  Swal.fire(
    'Account!',
    'Logged out!',
    'successfully'
  )
  window.location="login.html";
  document.getElementById("user_login").style.display="inline";
  document.getElementById("user_logout").style.display="none";
}

async function check()
{
  let user = Moralis.User.current();
  if(user.get("ethAddress"))
  {
  document.getElementById("myBtn").style.display = "none";
  document.getElementById("btn-logout").style.display = "inline";
  document.getElementById("myModal").style.display = "none";
  add = user.get("ethAddress");
  } 
}

async function logOut() {
  await Moralis.User.logOut();
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'Wallet Disconnected!',
  })
  document.getElementById("myBtn").style.display = "inline";
  document.getElementById("btn-logout").style.display = "none";
}

async function login() {
  getnftdata();
  await Moralis.enableWeb3({ provider: 'walletconnect' })
  add =  web3.provider.accounts[0]
  // console.log(add);
  console.log(web3.provider);
  Swal.fire(
    'Welcome to blockafide!',
    'Wallet Connected!',
    'successfully'
  )
  document.getElementById("myBtn").style.display = "none";
  document.getElementById("btn-logout").style.display = "inline";
  modal.style.display = "none";
}

async function connectmeta() {

  let user = Moralis.User.current();
  if (!user) {
    try {
      user = await Moralis.authenticate({ signingMessage: "Hello World!" });
      document.getElementById("myBtn").style.display = "none";
      document.getElementById("btn-logout").style.display = "inline";
      modal.style.display = "none";
      Swal.fire(
        'Welcome to blockafide!',
        'Wallet Connected!',
        'successfully'
      )
      add = (user.get("ethAddress"));
      console.log(add);
    } catch (error) {
      console.log(error);
    }
  }
}

var add;

const web3 = new Web3(window.ethereum);

// async function upload(){
//   if ("user" in localStorage) {
//     console.log("login");
//     document.getElementById("user_logout").style.display="inline";
//     document.getElementById("user_login").style.display="none";

//   if(add == undefined){
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Please connect Wallet!',
//     })
//     return;
//   }
//   // let user = Moralis.User.current();
//   await Moralis.enableWeb3();
//   var chainId = await Moralis.getChainId();
//   if(chainId != '0x4')
//   {
//     document.getElementById("resultSpace").innerHTML =  
//     `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="PLEASE CHANGE YOUR CHAIN ID TO RINKEBY 0X4">`;
  
//   return;
//   }
//   const fileInput = document.getElementById("file");
 
//   const data = fileInput.files[0];

//   if(fileInput == '' || data == undefined){
//     alert("Please Enter All Fields");
//     return;
//   }

//   const imageFile = new Moralis.File(data.name, data);
//   document.getElementById('upload');
//   document.getElementById('file');
//   document.getElementById('name');
//   document.getElementById('description');
//   var imgname = data.name.includes('(');
//   console.log(data.name, typeof data.name, imgname, typeof imgname);
//   if(imgname == true){
//     Swal.fire({
//       icon: 'error',
//       title: 'Oops...',
//       text: 'Please remove special characters in your file name!',
//       footer: '<a href="index.html">My NFTS</a>'
//     })
//   }
//   await imageFile.saveIPFS();
 
//   const imageURI = imageFile.ipfs();
//   const metadata = {
//     "name":document.getElementById("name").value,
//     "description":document.getElementById("description").value,
//     "image":imageURI
//   }
//   console.log('metadata', metadata);
  
//   const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
//   await metadataFile.saveIPFS();
//   const metadataURI = metadataFile.ipfs();
//   const txt = await mintToken(metadataURI).then(notify)
// }
// else {
//  console.log("not found");
//  window.location="login.html";
//  document.getElementById("user_logout").style.display="none";
//  document.getElementById("user_login").style.display="inline";
// }
// }

async function mintToken(_uri){
  // const encodedFunction = web3.eth.abi.encodeFunctionCall({
  //   name: "mintToken",
  //   type: "function",
  //   inputs: [{
  //     type: 'string',
  //     name: 'tokenURI'
  //     }]
  // }, [_uri]);

  // const transactionParameters = {
  //   to: nft_contract_address,
  //   from: ethereum.selectedAddress,
  //   data: encodedFunction
  // };
  // const txt = await ethereum.request({
  //   method: 'eth_sendTransaction',
  //   params: [transactionParameters]
  // });
  // return txt
}

async function notify(_txt){
  document.getElementById("resultSpace").innerHTML = '';
  document.getElementById("resultSpace").innerHTML =  
  `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="Your NFT was minted in transaction '${_txt}'">`;
  Swal.fire(
    'Wait for 2 minutes!',
    'to mint your NFT!',
    'successfully'
  )
} 

const options = {
  address: "0x7dE3085b3190B3a787822Ee16F23be010f5F8686",
  chain: "eth",
};