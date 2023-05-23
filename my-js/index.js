// const serverUrl = "https://gjyexdlwsqwi.usemoralis.com:2053/server";
// const appId = "zNakMsSAjNQYtzbJnJ9vaKfZRfKtEz2tvjS9FcCZ";
// Moralis.start({ serverUrl, appId });

var account = localStorage.getItem("user");
if ("user" in localStorage) {
  console.log("login");
  document.getElementById("user_logout").style.display = "inline";
  document.getElementById("user_login").style.display = "none";
} else {
  console.log("not found");
  document.getElementById("user_logout").style.display = "none";
  document.getElementById("user_login").style.display = "inline";
}

if ("walletAddress" in localStorage) {
  getnftdata();
  console.log("login");
  document.getElementById("myBtn").style.display = "none";
  document.getElementById("btn-logout").style.display = "inline";
}
 else {
  console.log("not found");
  document.getElementById("myBtn").style.display = "inline";
  document.getElementById("btn-logout").style.display = "none";
}

var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-metamask").onclick = connectmeta;
document.getElementById("btn-logout").onclick = logOut;

async function logoutac() {
  localStorage.clear();
  Swal.fire("Account!", "Logged out!", "successfully");
  document.getElementById("user_login").style.display = "inline";
  document.getElementById("user_logout").style.display = "none";
}

async function check() {
  let user = Moralis.User.current();
  if (user.get("ethAddress")) {
    document.getElementById("myBtn").style.display = "none";
    document.getElementById("btn-logout").style.display = "inline";
    document.getElementById("myModal").style.display = "none";
    wlt = user.get("ethAddress");
    // getNfts(wlt);
  }
}

// async function logOut() {
//   await Moralis.User.logOut();
//   Swal.fire({
//     icon: "error",
//     title: "Oops...",
//     text: "Wallet Disconnected!",
//   });
//   document.getElementById("mynfts").style.display = "none";
//   document.getElementById("myBtn").style.display = "inline";
//   document.getElementById("btn-logout").style.display = "none";
// }

// async function login() {
//   getnftdata();
//   await Moralis.enableWeb3({ provider: "walletconnect" });
//   Swal.fire("Welcome to blockafide!", "Wallet Connected!", "successfully");
//   document.getElementById("myBtn").style.display = "none";
//   document.getElementById("btn-logout").style.display = "inline";
//   modal.style.display = "none";
// }

//////////////////////////////////// working ////////////////////////////////
async function connectmeta() {
  console.log("Function working");
  const chainId = 56; 
  const hexChainId = "0x" + chainId.toString(16); 
  const rpcUrl = "https://bsc.blockpi.network/v1/rpc/public"; 
  const chainName = "BSD"; 
  if (typeof window.ethereum !== "undefined") {
  
    const provider = window.ethereum;
    provider
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: hexChainId,
            chainName: chainName,
            rpcUrls: [rpcUrl],
            blockExplorerUrls: ["https://bscscan.com"],
          },
        ],
      })
      .then(function () {
        
        provider
          .enable()
          .then(function (accounts) {
            console.log("Connected to BSD with account:", accounts[0]);

            if (
              typeof window.ethereum !== "undefined" &&
              window.ethereum.isConnected()
            ) {
              console.log("Wallet is connected");
              document.getElementById("myBtn").style.display = "none";
              document.getElementById("btn-logout").style.display = "inline";
              modal.style.display = "none";
              Swal.fire(
                "Welcome to blockafide!",
                "Wallet Connected!",
                "successfully"
              );
              const wlt = user.get("ethAddress");
              console.log(wlt);
              // getNfts(wlt);
            }
          })
          .catch(function (error) {
            console.log("Failed to connect to BSD:", error);
          });
      })
      .catch(function (error) {
        console.log("Failed to add BSD network to Metamask:", error);
      });
  } else {
    console.log("Metamask not detected.");
  }

 

  // let user = Moralis.User.current();
  // if (!user) {
  //   try {
  //     user = await Moralis.authenticate({ signingMessage: "Hello World!" });
  //     document.getElementById("myBtn").style.display = "none";
  //     document.getElementById("btn-logout").style.display = "inline";
  //     modal.style.display = "none";
  //     Swal.fire(
  //       'Welcome to blockafide!',
  //       'Wallet Connected!',
  //       'successfully'
  //     )
  //     const wlt = (user.get("ethAddress"));
  //     console.log(wlt);
  //     getNfts(wlt);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}

getnftdata();

///marketplace start
function getnftdata() {
  //transfer();
  fetch("http://217.160.146.227:3000/displaynft")
    .then((res) => res.json())
    .then(function (nftdata) {
      console.log(nftdata);
      nftdata.forEach((element) => {
        console.log(element);

        document.getElementById("nfts").innerHTML += `
        <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="blog__item">
                    <div class="blog__item__pic set-bg"><img class="product__item__pic set-bg" src="${element.nft}" alt=""></div>
                    <div class="blog__item__text">
                        
                    <h6>${element.nft_name}</h6>
                    <h5> <i class="fa-brands fa-ethereum"></i>${element.nft_price}</h5>
                    <button onclick="transfer('${element.token_id}','${element.owner_of}','${element.token_address}','${element.nft_price}')" id="buy" class="add-cart" style="background-color: black; color: white;">Buy Now</button>
                    </div>
                    
                </div>
            </div>

        `;
      });
    });
}
async function transfer(tokenid, rcvwlt, caddress, price) {
 
  const web3 = new Web3(window.ethereum)
    let user = localStorage.getItem('walletAddress')
    const contractABI = [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "approved",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "ApprovalForAll",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "buyNFT",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "delistNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "listNFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "recipient",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenURI",
            "type": "string"
          }
        ],
        "name": "mintNFT",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "NftDelisted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "NftListed",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "string",
            "name": "tokenURI",
            "type": "string"
          }
        ],
        "name": "NftMinted",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "address",
            "name": "buyer",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "NftSold",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "safeTransferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "approved",
            "type": "bool"
          }
        ],
        "name": "setApprovalForAll",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllNFTs",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isForSale",
                "type": "bool"
              }
            ],
            "internalType": "struct Blockafide.Nft[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getApproved",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "walletAddress",
            "type": "address"
          }
        ],
        "name": "getMyNFTs",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isForSale",
                "type": "bool"
              }
            ],
            "internalType": "struct Blockafide.Nft[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "getNFT",
        "outputs": [
          {
            "components": [
              {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
              },
              {
                "internalType": "bool",
                "name": "isForSale",
                "type": "bool"
              }
            ],
            "internalType": "struct Blockafide.Nft",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "operator",
            "type": "address"
          }
        ],
        "name": "isApprovedForAll",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "ownerOf",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes4",
            "name": "interfaceId",
            "type": "bytes4"
          }
        ],
        "name": "supportsInterface",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "tokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
 
    var ContractAddress = '0xc68DC2f28b5D22C55e41ca9C956231a781489D5F'

 
  if (user) {
    console.log(tokenid);
    console.log(rcvwlt);
    console.log(caddress);
    console.log(price, "price");

    const approveInstance = new web3.eth.Contract(contractABI, ContractAddress);

    const contractInstance = new web3.eth.Contract(contractABI, ContractAddress);

const tokenId = tokenid;

    // approveInstance.methods.approve(rcvwlt, tokenId).send({ from: user })
    // .on('transactionHash', (hash) => {
    //   console.log('Transaction hash:', hash);
    // })
    // .on('confirmation', (confirmationNumber, receipt) => {
    //   console.log('Confirmation number:', confirmationNumber);
    //   // Process the receipt if needed
    // })
    // .on('error', (error) => {
    //   console.error('Error:', error);
    // });




    const valueInWei = web3.utils.toWei(price.toString(), 'ether');


    contractInstance.methods.buyNFT(tokenId).send({ from: user, value: valueInWei })
  .on('transactionHash', (hash) => {
    console.log('Transaction hash:', hash);
    if(hash){
      fetch("http://217.160.146.227:3000/updatenft", {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        method: "POST",
        body: JSON.stringify({
          tokenid: tokenId,
          rcvwlt: user,
          caddress: caddress,
        }),
      });
      }else{}
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('Confirmation number:', confirmationNumber);
    // Process the receipt if needed
  })
  .on('error', (error) => {
    console.error('Error:', error);
  });


    // contractInstance.methods.buyNFT(tokenId).send({ from: user, value: valueInWei })
    //   .on('transactionHash', (hash) => {
    //     console.log('Transaction hash:', hash);
    //     if(hash){
    //     fetch("http://217.160.146.227:3000/updatenft", {
    //       headers: {
    //         "Content-type": "application/json; charset=UTF-8",
    //       },
    //       method: "POST",
    //       body: JSON.stringify({
    //         tokenid: tokenId,
    //         rcvwlt: user,
    //         caddress: caddress,
    //       }),
    //     });
    //     }else{}
    //   })
    //   .on('confirmation', (confirmationNumber, receipt) => {
    //     console.log('Confirmation number:', confirmationNumber);
    //     // Process the receipt if needed
    //     window.location.reload();
    //   })
    //   .on('error', (error) => {
    //     console.error('Error:', error);
    //   });
  











    //   const web3 = await Moralis.enableWeb3();

  //   let user = Moralis.User.current();
  //   if (!user) {
  //     user = await Moralis.authenticate({
  //       signingMessage: "SIGN IN TO MARKETPLACE",
  //     });
  //   } else {
  //     console.log(user.get("ethAddress"));
  //     const wallet = user.get("ethAddress");
  //     const options = {
  //       type: "native",
  //       // amount: Moralis.Units.ETH(price),
  //       amount: Moralis.Units.ETH("0.0001"),
  //       receiver: rcvwlt,
  //     };
  //     let result = await Moralis.transfer(options);
  //     console.log(result);
      
  //   }
  // } else {
  //   Swal.fire({
  //     icon: "error",
  //     title: "Oops...",
  //     text: "PLease register yourself for buying NFT!",
  //   });
  //   console.log("not found");
  //   window.location = "login.html";
    // document.getElementById("user_logout").style.display="none";
  }
}
///////marketplace end

///mynfts start
// async function getNfts(wlt) {
//   document.getElementById("login");
//   const options = { chain: "Rinkeby", address: wlt };
//   const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
//   console.log(polygonNFTs);
//   for (var i = 0; i <= polygonNFTs.total; i++) {
//     // const tokenad = (polygonNFTs.result[i].token_address);
//     const token = polygonNFTs.result[i].token_id;
//     fetch(polygonNFTs.result[i].token_uri)
//       .then((res) => res.json())
//       .then(function (data) {
//         console.log(data);
//         document.getElementById("mynfts").innerHTML += `
//           <div class="col-lg-4 col-md-6 col-sm-6">
//           <div class="blog__item">
//               <div class="blog__item__pic set-bg"><img class="product__item__pic set-bg" src="${data.image}" alt=""></div>
//               <div class="blog__item__text">
                  
//               <h6>${data.name}</h6>
//               <h5> <i class="fa-brands fa-ethereum"></i>${data.description}</h5>
//               <a href="buynft.html?id=${token}"><button onclick="forsell()" id="sellbtn" class="add-cart" style="background-color: black; color: white;">List For sell</button></a>
//               </div>
              
//           </div>
//       </div>
 
//         `;
//       });
//     console.log(polygonNFTs.result[i].token_uri);
//   }
// }

// async function getNfts(wlt) {
//   document.getElementById("login");
//   const options = { chain: 'Rinkeby', address: wlt, };
//     const polygonNFTs = await Moralis.Web3API.account.getNFTs(options);
//     console.log(polygonNFTs);
//     for(var i=0;i <= polygonNFTs.total;i++)
//     {
//       // const tokenad = (polygonNFTs.result[i].token_address);
//       const token = (polygonNFTs.result[i].token_id);
//       fetch(polygonNFTs.result[i].token_uri)
//       .then(res=>res.json())
//       .then(function (data){
//         console.log(data);
//         document.getElementById("mynfts").innerHTML += `
//     <div class="col-lg-4">
//       <div class="single-popular-course">
//         <div class="thumb">
//           <img id="nftimg" class="f-img img-fluid mx-auto" style="height:300px; width:300px; border-radius:8px;" src="${data.image}" alt="" />

//         </div>
//         <div class="details">
//           <div class="d-flex justify-content-between mb-20">
//             <p id="nftdesc" class="name">${data.description}</p><br/>
//             <p hidden>${token}</p>
//           </div>
//           <a href="#">
//             <h4 id="nftname">${data.name}</h4>
//           </a>
//           <div class="d-flex justify-content-between mb-20" style="color:white;">
//             <button type="button" class="btn mt-2" style="background-color: #8732a8; color: white;" onclick="forsell()" id="sellbtn"><a href="buynft.html?id=${token}" style="color:white;">list for sell</a></button>
//               <div id="buy">
//               </div>
//           </div>
//         </div>
//       </div>
//     </div>
//         `;
//       })
//       console.log(polygonNFTs.result[i].token_uri)
//     }
// }
