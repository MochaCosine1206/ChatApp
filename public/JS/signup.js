
$(document).ready(function () {
  let socket = io.connect('http://localhost:8080');
  // socket.on('connect', function(){
  //   console.log("In sign-up");
  // })
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var emailInput = $("input#email-input");
  var passwordInput = $("input#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function (event) {
    event.preventDefault();
    var userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  
  //Function to listen for Email Form Data Validation on input
   $('#password-input').prop('disabled', true);
   $('#signup-submit').prop('disabled', true);
$('#email-input').on('input', function () {
    var input = $(this);
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var is_email = re.test(input.val());
    if (is_email) {
        input.removeClass("invalid").addClass("valid");
        $('#password-input').prop('disabled', false);
        $('#signup-submit').prop('disabled', true);
    }
    else {
        input.removeClass("valid").addClass("invalid");
        $('#password-input').prop('disabled', true);
        $('#signup-submit').prop('disabled', true);
    }
});

$('#password-input').on('input', function () {
    var input = $(this);
    var re = /^[^-]{1}?[^\"\']*$/;
    var is_pass = re.test(input.val());
    if (is_pass) {
      input.removeClass("invalid").addClass("valid");
      $('#signup-submit').prop('disabled', false);
    }
    else {
      input.removeClass("valid").addClass("invalid");
      $('#signup-submit').prop('disabled', true);
    }
});



  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(email, password) {
    $.post("/api/signup", {
      email: email,
      password: password
    }).then(function (data) {
      window.location.replace(data);
      // If there's an error, handle it by throwing up a bootstrap alert
    }).catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
