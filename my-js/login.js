function login(){
    var email = document.getElementById("emaill").value;
    var password = document.getElementById("passwordd").value;
    if (email == '' || password == '' ) 
    {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all fields!',
          })
    } else {
  fetch("http://217.160.146.227:3000/login?email="+email+"&password="+password)
    .then(function(res) {
        return res.json();
    })
    .then(function(data) {
        console.log(data, "data");
        if (data.length == 1) {
            console.log(data)
            data.forEach(element => {
               console.log(element)
               console.log(element.email);

            localStorage.setItem("user",element.email);
            console.log(localStorage.getItem("user"));

            Swal.fire(
                'Good job!',
                'Login successfully!',
                'success'
              )
            })
            window.location = 'index.html';
        //  localStorage.getItem(data.email);
        // Session["user"] = (data.email);
        // console.log(localStorage.getItem(data.email));
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Incorrect email and password!',
              })
          return 0;
      }
    
   });
  }
}
