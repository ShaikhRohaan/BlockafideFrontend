function contactus(){

    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var subject = document.getElementById("subject").value;
    var msg = document.getElementById("message").value;
    var phone = document.getElementById("phone").value;
  
    if (name == '' || email == '' || subject == '' || phone == '' || msg == '') 
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'please fill all fields!',
        footer: '<a href="index.html">index page</a>'
      })
    } else {
     
            fetch("http://217.160.146.227:3000/contactus", {
              headers: {
                "Content-type": "application/json; charset=UTF-8"
              },
              method: "POST",
              body: JSON.stringify({ "name": name, "email": email , "phone": phone, "subject": subject, "msg": msg}),
            })
            Swal.fire(
              'Thanks!',
              'For Contact Us!',
              'We Will Connect You Soon'
            )
            // alert("Thanks  .");
            window.location = 'contact.html';
          }
    
        }
     
   
// })
