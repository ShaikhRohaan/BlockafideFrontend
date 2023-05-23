function forgetpswrd(){
    var email = document.getElementById("email").value;
    console.log(email);
    if(email== '')
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all fields!',
      })
    }
    else
    {
  fetch("http://217.160.146.227:3000/forgetpswrd?email="+email)
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        console.log(data, "data");
        if (data.length == 1) {
            console.log(data)
            fetch("http://217.160.146.227:3000/resetpswrd", {
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              },
              method: "POST",
              body: JSON.stringify({"email": email}),
            })
            alert("password generated Successfully");
            // alert("login Successfully");
            // window.location = 'nftmarket.html';
        } else {
            alert("You are not registered");
           
          return 0;
      }
   });
  }
}
