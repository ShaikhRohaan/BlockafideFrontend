
// const serverUrl = "https://gjyexdlwsqwi.usemoralis.com:2053/server";
// const appId = "zNakMsSAjNQYtzbJnJ9vaKfZRfKtEz2tvjS9FcCZ";
// Moralis.start({ serverUrl, appId });

var account = (localStorage.getItem("user"));
var wallet = (localStorage.getItem("walletAddress"));
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

if ("walletAddress" in localStorage) {
  getnftdata();
  console.log("login");
  document.getElementById("myBtn").style.display = "none";
  document.getElementById("btn-logout").style.display = "inline";
  modal.style.display = "none";
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
  wlt = user.get("ethAddress");
  console.log(wlt);
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
getnftdata();
async function login() {
  await Moralis.enableWeb3({ provider: 'walletconnect' })
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
      const wlt = (user.get("ethAddress"));
      console.log(wlt);
    } catch (error) {
      console.log(error);
    }
  }
}

///marketplace start
function getnftdata() {
  //transfer();
  fetch('http://217.160.146.227:3000/displaynft')

    .then(res => res.json())
    .then(function (nftdata) {
      console.log(nftdata)
      nftdata.forEach(element => {
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
      })
    })
}
async function transfer(tokenid, rcvwlt, caddress, price) {
  if ("user" in localStorage) {
    console.log("login");
    document.getElementById("user_logout").style.display="inline";
    document.getElementById("user_login").style.display="none";
 
  console.log(tokenid);
  console.log(rcvwlt);
  console.log(caddress);
  console.log(price, "price");
  const web3 = await Moralis.enableWeb3();

  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({ signingMessage: "SIGN IN TO MARKETPLACE" });

  }
  else {
    console.log(user.get('ethAddress'));
    const wallet = user.get('ethAddress');
    const options = {
      type: "native",
      // amount: Moralis.Units.ETH(price),
      amount: Moralis.Units.ETH("0.0001"),
      receiver: rcvwlt,
    };
    let result = await Moralis.transfer(options);
    console.log(result)
    fetch("http://217.160.146.227:3000/updatenft", {
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      },
      method: "POST",
      body: JSON.stringify({ tokenid: tokenid, rcvwlt: wallet, caddress: caddress }),
    })
  }
}
else {
 console.log("not found");
 window.location="login.html";
 document.getElementById("user_logout").style.display="none";
 document.getElementById("user_login").style.display="inline";
}
}
///////marketplace end