'use strict'
const nft_contract_address = '0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431'



const options = {
  address: "0x7dE3085b3190B3a787822Ee16F23be010f5F8686",
  chain: "eth",
};

// Unpkg imports web3Modal
var Web3Modal = window.Web3Modal.default
var WalletConnectProvider = window.WalletConnectProvider.default
var EvmChains = window.EvmChains
var Fortmatic = window.Fortmatic

var web3Modal

var provider

var selectedAccount

function init() {
  console.log('Initializing example')
  console.log('WalletConnectProvider is', WalletConnectProvider)
  console.log('Fortmatic is', Fortmatic)

  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: '8043bb2cf99347b1bfadfb233c5325c0',
      },
    },

    fortmatic: {
      package: Fortmatic,
      options: {
        key: 'pk_test_391E26A3B43A3350',
      },
    },
  }

  web3Modal = new Web3Modal({
    network: 'rinkeby',
    cacheProvider: false, // optional
    providerOptions, // required
  })
}

async function fetchAccountData() {
  const web3 = new Web3(provider)

  console.log('Web3 instance is', web3)

  const chainId = await web3.eth.getChainId()

  const accounts = await web3.eth.getAccounts()

  console.log('Got accounts', accounts)
  getnftdata()
  await getNfts(accounts)
  selectedAccount = accounts[0]

  localStorage.setItem('walletAddress', accounts[0])

  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address)

    const ethBalance = web3.utils.fromWei(balance, 'ether')
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4)
  })

  await Promise.all(rowResolvers)

  console.log('Wallet is connected')
  document.getElementById('myBtn').style.display = 'none'
  document.getElementById('btn-logout').style.display = 'inline'
}

async function refreshAccountData() {
  document.getElementById('myBtn').style.display = 'none'
  document.getElementById('btn-logout').style.display = 'inline'

  await fetchAccountData(provider)
}

async function onConnect() {
  let wallet = ''
  console.log('Opening a dialog', web3Modal)
  try {
    provider = await web3Modal.connect()
    const accounts = await web3.eth.getAccounts()
    const chainId = await web3.eth.getChainId();
    localStorage.setItem('walletAddress', accounts[0])
    localStorage.setItem('chainid', chainId)
    wallet = accounts[0]
  } catch (e) {
    console.log('Could not get a wallet connection', e)
    return
  }

  // Subscribe to accounts change
  provider.on('accountsChanged', (accounts) => {
    fetchAccountData()
  })

  // Subscribe to chainId change
  provider.on('chainChanged', (chainId) => {
    fetchAccountData()
  })

  // Subscribe to networkId change
  provider.on('networkChanged', (networkId) => {
    fetchAccountData()
  })

  await refreshAccountData()

  await getNfts(wallet)
  window.location.reload()
}

async function onDisconnect() {
  // console.log('Killing the wallet connection', provider)
  // await provider.close()

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    localStorage.clear();
    sessionStorage.clear();
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    await web3Modal.clearCachedProvider()
    provider = null
    window.location.reload()
  // TODO: Which providers have close method?
  // if (provider.close) {
    
  
  // }

  selectedAccount = null

  // Set the UI back to the initial state
  //   document.querySelector("#prepare").style.display = "block";
  //   document.querySelector("#connected").style.display = "none";
  document.getElementById('btn-logout').style.display = 'none'
  document.getElementById('myBtn').style.display = 'inline'
  localStorage.removeItem('walletAddress')
}

window.addEventListener('load', async () => {
  init()
  document.querySelector('#myBtn').addEventListener('click', onConnect)
  document.querySelector('#btn-logout').addEventListener('click', onDisconnect)
})

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function getnftdata() {
  //transfer();
  fetch('http://217.160.146.227:3000/displaynft')
    .then((res) => res.json())
    .then(function (nftdata) {
      // console.log(nftdata)
      nftdata.forEach((element) => {
        // console.log(element);

        document.getElementById('nfts').innerHTML += `
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
  
          `
      })
    })

}
async function getNfts() {
  let account = localStorage.getItem('walletAddress')
  const contractAbi = [
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
  var ContractAddress = '0x03642223B11C53a274e3ba0C1D6601d85975EEA3'

  const contract = new web3.eth.Contract(contractAbi, ContractAddress);




  console.log('Wallet address for nft' + account)
  // document.getElementById('login')
  // const options = { chain: 'Rinkeby', address: account }
  // const polygonNFTs = await Moralis.Web3API.account.getNFTs(options)
  // console.log(polygonNFTs)
   // Replace with the wallet address you want to query
  contract.methods.getMyNFTs(account).call()
    .then(nfts => {
  
        for (var i = 0; i <= nfts.length; i++) {
    // const tokenad = (polygonNFTs.result[i].token_address);
    const token = nfts[i].tokenId
    
   if(nfts[i].isForSale == false){
    console.log(nfts[i].isForSale)
    let nftid = nfts[i].tokenId
     fetch(nfts[i].tokenURI)
      .then((res) => res.json())
      .then(function (data) {
        console.log(data)
        document.getElementById('mynfts').innerHTML += `
            <div class="col-lg-4 col-md-6 col-sm-6">
            <div class="blog__item">
                <div class="blog__item__pic set-bg"><img class="product__item__pic set-bg" src="${data.image}" alt=""></div>
                <div class="blog__item__text">
                    
                <h6>${data.name}</h6>
                <h5> <i class="fa-brands fa-ethereum"></i>${data.description}</h5>
                <a href="buynft.html?id=${nftid}"><button onclick="forsell()" id="sellbtn" class="add-cart" style="background-color: black; color: white;">List For sell</button></a>
                </div>
                
            </div>
        </div>
        `
        
      })
   }
    // console.log(nfts)
   
  }
    })
    .catch(error => {
      console.error(error);
    });
  // ?ipfs=${tokenData[0].tokenURI}

  // idgetNfts()


  
}



getNfts()





async function idgetNfts(value) {
  const web3 = new Web3(window.ethereum)

  var tokenId = value
  // console.log(tokenId)
  let account = localStorage.getItem('walletAddress')
  
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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

  var ContractAddress = '0x03642223B11C53a274e3ba0C1D6601d85975EEA3'

  var contract = new web3.eth.Contract(contractABI, ContractAddress);

  console.log('Wallet address for nft' + account)

  contract.methods.getNFT(tokenId).call((error, result) => {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
     
      var tokenid = result.tokenId
     console.log(tokenid)
    fetch(result.tokenURI)
     .then((res) => res.json())
     .then(async function (data) {
       console.log(data)
       document.getElementById('img').innerHTML=`
       <img class="f-img img-fluid mx-auto" style="height:100%; width:100%;" src="${data.image}" alt="" />
       `
       document.getElementById('dec').innerHTML=`
       <p class="name black">${data.description}</p>
       `
       document.getElementById('name').innerHTML=`
       ${data.name}
       `
       document.getElementById('list').innerHTML=`
       <button type="button" id="pricebtn" onclick="submitp('${tokenid}')" class="btn btn-primary btn-lg" style="background-color: black; color: white;">list for sell</button>
       `
      //  document.getElementById('buysell1222nftwewe').innerHTML=`
      // //  <img src=${data.image} alt='nft' ></img>
      // //  <h5>Token ID = ${tokenid}</h5></br>
      // //  <h4>Token Name = ${data.name}</h4></br>
      // //  <p><b>Decription  </b> ${data.description} </p>
      
      //  `
    //   document.getElementById("buysell1222nftwewe").innerHTML == `
    //  <div class="row">
    //   <div class="col-lg-8 col-md-8 col-sm-12">
    //  <div class="single-popular-course mt-4" >
    //   <input hidden type="text" id="tokenid" name="tokenid" class="form-control form-control-lg"
    //                         value="${tokenid}" />
    //       <div class="thumb">
    //         <img class="f-img img-fluid mx-auto" style="height:300px; width:300px;" src="${data.image}" alt="" />
    //       </div>
    //       <div class="details">
    //         <div class="d-flex justify-content-between mb-20">
    //           <p class="name black">${data.description}</p>
    //         </div>
    //           <h4>${data.name}</h4>
    //         <div id="buy" class="d-flex justify-content-between mb-20 mt-2">
    //         <input type="Number" id="nftprice" name="price" placeholder="enter price for NFT">
    //         </div>
    //          <div class="text-center text-lg-start mt-4 d-flex ">
    //            <button type="button" id="pricebtn" onclick="submitp('${data.name}','${data.description}','${data.image}','${tokenid}','${tokenadd}','${owner_of}')" class="btn btn-primary btn-lg" style="background-color: black; color: white;">list for sell</button>
    //          </div>
    //       </div>
    //     </div>
    //   </div>
    //     </div>
    //    `
       
     })
      // for (var i = 0; i <= result.length; i++) {
      
      //   // console.log(nfts)
       
      // }
      // Process the returned result
      // Access specific properties like result.tokenId, result.owner, etc.
    }
  })


  // ?ipfs=${tokenData[0].tokenURI}




  
}







async function upload(){
  const web3 = new Web3(window.ethereum);
  let account = localStorage.getItem('walletAddress')
  const contractAbi = [
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
            },
            {
              "internalType": "address",
              "name": "seller",
              "type": "address"
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
  var ContractAddress = '0x03642223B11C53a274e3ba0C1D6601d85975EEA3'

  const contract = new web3.eth.Contract(contractAbi, ContractAddress);





  const projectId = "2ONz2uaIc96ZLYdFCsMEt6t0Bq2";
  const projectSecret = 'e834e0cdc99f518a02d86c0fa2ba8ec4';

  const ipfs = window.IpfsHttpClient.create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
    authorization: 'Basic Mk9OejJ1YUljOTZaTFlkRkNzTUV0NnQwQnEyOmU4MzRlMGNkYzk5ZjUxOGEwMmQ4NmMwZmEyYmE4ZWM0'
    }
  })

  const fileInput = document.getElementById("file");
   
  const data = fileInput.files[0];

  if(fileInput == '' || data == undefined){
    alert("Please Enter All Fields");
    return;
  }


const file = data;
const fileContent = await file.arrayBuffer();
const result = await ipfs.add({ content: fileContent });

// try {
let name =  document.getElementById('name').value;
let des =  document.getElementById('description').value;

const metadata = {
name: name,
description: des,
image: `https://ipfs.io/ipfs/${result.cid}`
};
const added = await ipfs.add(JSON.stringify(metadata));
console.log(`https://ipfs.io/ipfs/${added.cid}`)

// output.innerHTML = `File uploaded to IPFS with CID: <a href="https://ipfs.io/ipfs/${added.cid}" target="_blank">${added.cid}</a>`;
// } catch (error) {
// console.error('Error uploading file to IPFS:', error);
// // output.textContent = 'Error uploading file to IPFS.';
// }
    
  // document.getElementById('upload');
  // document.getElementById('file');
  // const name  = document.getElementById('name');
  // const decription  = document.getElementById('description');
  // var imgname = data.name.includes('(');
  
  // console.log(data.name, typeof data.name, imgname, typeof imgname);

  // if(imgname == true){
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Oops...',
  //     text: 'Please remove special characters in your file name!',
  //     footer: '<a href="index.html">My NFTS</a>'
  //   })
  // }

  
  // const metadata = {
  //   "name": name.value,
  //   "description": decription.value ,
  //   // "image": data
  //   "image" : 'https://gateway.pinata.cloud/ipfs/QmVevtawCRrGwD3xbuiKxvJQG8kPo3q1dZK5NswReKGsoL'
  // }
  // console.log('metadata', metadata);

  const tokenURI = `https://ipfs.io/ipfs/${added.cid}`;

  contract.methods.mintNFT(tokenURI).send({ from: account })
  .on('transactionHash', (hash) => {
    console.log('Transaction hash:', hash);
  })
  .on('confirmation', (confirmationNumber, receipt) => {
    console.log('Confirmation number:', confirmationNumber);
    // Process the receipt if needed
  })
  .on('error', (error) => {
    console.error('Error:', error);
  });


  // const recipient = account
  // contract.methods.mintNFT(tokenURI).send({ from: account })
  // .on("transactionHash", function (hash) {
  //   console.log("Transaction hash:", hash);
  // })
  // .on("receipt", function (receipt) {
  //   console.log("Transaction receipt:", receipt);
  // })
  // .on("error", function (error) {
  //   console.error("Transaction error:", error);
  // });
  
}


  async function uploadold(){
    // let IPFS = process.env.IPFS_KEY
    const client = new Web3Storage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDA3ZGE2NDVDRTk3OTc3NTAxMDFGYzFiNjhmNjcyZjZmMDY0ZGNiMDEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2ODM3MDQ1MDcxODQsIm5hbWUiOiJCbG9ja2FmaWRlIn0.vFN_rUeVhMan0DJ5uc9cwxWU9L4bS6xouyDLMaQ5KC0" });
    if ("user" in localStorage) {
      console.log("login");
      document.getElementById("user_logout").style.display="inline";
      document.getElementById("user_login").style.display="none";
  
    // if(!wallet){
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Oops...',
    //     text: 'Please connect Wallet!',
    //   })
    //   return;
    // }
    // let user = Moralis.User.current();
    // await Moralis.enableWeb3();
    // const accounts = await web3.eth.getAccounts()
    // var chainId = await Moralis.getChainId();
    const chainId = localStorage.getItem('chainid');
  
    console.log(chainId);
  
    // if(chainId != '0x4')
    // {
    //   document.getElementById("resultSpace").innerHTML =  
    //   `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="PLEASE CHANGE YOUR CHAIN ID TO RINKEBY 0X4">`;
    
    // return;
    // }
    
    const fileInput = document.getElementById("file");
   
    const data = fileInput.files[0];
  
    if(fileInput == '' || data == undefined){
      alert("Please Enter All Fields");
      return;
    }
  
    // const imageFile = new Moralis.File(data.name, data);
  
  
  
    const blob = new Blob([data], { type: 'application/json' });
    const jsonFile = new File([blob], 'meta.json');
    const cid = await client.put([jsonFile]);
    const url = `https://${cid}.ipfs.w3s.link/meta.json`;
    console.log(url);
  
  
  
  
  
    document.getElementById('upload');
    document.getElementById('file');
    document.getElementById('name');
    document.getElementById('description');
    var imgname = data.name.includes('(');
    console.log(data.name, typeof data.name, imgname, typeof imgname);
    if(imgname == true){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please remove special characters in your file name!',
        footer: '<a href="index.html">My NFTS</a>'
      })
    }
    // await imageFile.saveIPFS();
   
    // const imageURI = imageFile.ipfs();
    const metadata = {
      "name":document.getElementById("name").value,
      "description":document.getElementById("description").value,
      "image":imageURI
    }
    console.log('metadata', metadata);
    
    // const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
    // await metadataFile.saveIPFS();
    // const metadataURI = metadataFile.ipfs();
    // const txt = await mintToken(metadataURI).then(notify)
  }
  else {
   console.log("not found");
   window.location="login.html";
   document.getElementById("user_logout").style.display="none";
   document.getElementById("user_login").style.display="inline";
  }
  }
  
  