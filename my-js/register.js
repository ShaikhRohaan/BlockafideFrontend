function register(){

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    // var cpassword = document.getElementById("cpassword").value;
    var phone = document.getElementById("phone").value;
  
    if (name == '' || email == '' || password == '' || phone == '' ) 
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill all fields!',
      })
    } else {
      // if(password == cpassword)
      // {
        fetch("http://217.160.146.227:3000/registerexist?email="+email+"&phone"+phone)
        .then(function(res) {
            return res.json();
        })
        .then(function(data) {
            console.log(data,"data");
                // email = data[0].email;
                // name = data[0].name;
           if (data.length >0 ) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'This email and password already in use!',
            })
           
          } else {
            // alert("data is ready to insert")
           
            fetch("http://217.160.146.227:3000/register", {
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              },
              method: "POST",
              body: JSON.stringify({ "name": name, "email": email , "phone": phone, "password": password}),
            })
     
    Swal.fire(
      'Good job!',
      'Registration Successfully!',
      'success'
    )
            window.location = 'login.html';
          }
          })
         
            }
      }

