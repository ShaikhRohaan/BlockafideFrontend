const serverUrl = "https://gjyexdlwsqwi.usemoralis.com:2053/server";
const appId = "zNakMsSAjNQYtzbJnJ9vaKfZRfKtEz2tvjS9FcCZ";
Moralis.start({ serverUrl, appId });

var account = (localStorage.getItem("user"));
if(account==1)
{
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: 'logged in!',
  })
  console.log("login");
  document.getElementById("user_login").style.display="none";
  document.getElementById("user_logout").style.display="inline";

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

async function check()
{
  let user = Moralis.User.current();
  if(user.get("ethAddress"))
  {
  document.getElementById("myBtn").style.display = "none";
  document.getElementById("btn-logout").style.display = "inline";
  document.getElementById("myModal").style.display = "none";
  wlt = user.get("ethAddress");
  getNfts(wlt);
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
//   getnftdata();
  await Moralis.enableWeb3({ provider: 'walletconnect' })
  const wlt = (user.get("ethAddress"));
  console.log(wlt);
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
    //   getNfts(wlt);
    } catch (error) {
      console.log(error);
    }
  }
}