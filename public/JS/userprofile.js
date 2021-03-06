

$(document).ready(function () {
    const profileForm = $("#userInfo")
    const nameInput = $("#name");
    const usernameInput = $("#userName");
    const userAbout = $("#userAboutMe");
    const userAvatar = $("#avatarImg");
    let seed = Math.floor(Math.random() * 5001);
    let avatarURL = "";
    let userID = "";



    // let avatarURL = "https://avatars.dicebear.com/v2/jdenticon/:" + seed + ".svg"


    function avatarChoice() {

    let counter = 1;
    const leftArrow = $(".previous");
    const rightArrow = $(".next");
    avatarURL ="https://avatars.dicebear.com/v2/avataaars/:" + counter + ".svg"
    userAvatar.attr("src", avatarURL)
    
    leftArrow.on("click",function(){
        counter--
    
        console.log(counter);
        avatarURL ="https://avatars.dicebear.com/v2/avataaars/:" + counter + ".svg"
        userAvatar.attr("src", avatarURL)
    })

    rightArrow.click(function(){
        counter++
        console.log(counter);
        avatarURL ="https://avatars.dicebear.com/v2/avataaars/:" + counter + ".svg"
        userAvatar.attr("src", avatarURL)
    })
    

    }

avatarChoice();


    //use custom avatar image for new profile

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function (data) {
        $(".member-name").text(data.email);
        userID = data.id;
    });

    

    profileForm.on("submit", function (event) {
        event.preventDefault();
        
        console.log("You pressed the Submit Button");
        console.log("Name: " + nameInput + " username: " + userName + " avatarURL: " + avatarURL + " About Me: " + userAbout)

        let profileData = {
            name: nameInput.val().trim(),
            userName: usernameInput.val().trim(),
            avatar_seed: avatarURL,
            tagline: userAbout.val().trim()
        }

        if (!profileData.name || !profileData.userName) {
            return;
        }

        addUserProfile(profileData.name, profileData.userName, profileData.avatar_seed, profileData.tagline);

        nameInput.val("");
        usernameInput.val("");
        userAbout.val("");

        function addUserProfile(name, userName, avatar_seed, tagline) {
            $.post("api/userProfiles", {
            name: name,
            userName: userName,
            avatar_seed: avatar_seed,
            tagline: tagline,
            UserId: userID
            }).then(function(data){

                getProfileData();
                window.location.href = "/chats";

            });

        }


        function getProfileData() {
            $.get("/api/userProfiles", function(data){
                console.log(data);
            })
        }
        
        });


   

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
      }

    // Client-side validation
      $('#nameInvalid').hide();
      $('#userNameInvalid').hide();
      $('#aboutInvalid').hide();
      $('#userprofile-submit').prop('disabled', true);
      $('#name').on('input', function () {
        var input = $(this);
        var re =/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
        var is_name = re.test(input.val());
        if (is_name) {
          input.removeClass("invalid").addClass("valid");
          $('#userprofile-submit').prop('disabled', true);
          $('#nameInvalid').hide();
        }
        else {
          input.removeClass("valid").addClass("invalid");
          $('#userprofile-submit').prop('disabled', true);
          $('#nameInvalid').show();
        }
    });

    $('#userName').on('input', function () {
        var input = $(this);
        var re = /^[A-Za-z 0-9 (!?@#$%&_*)]{3,15}$/;
        var is_userName = re.test(input.val());
        if (is_userName) {
          input.removeClass("invalid").addClass("valid");
          $('#userprofile-submit').prop('disabled', true);
          $('#userNameInvalid').hide();
        }
        else {
          input.removeClass("valid").addClass("invalid");
          $('#userprofile-submit').prop('disabled', true);
          $('#userNameInvalid').show();
        }
    });

    $('#userAboutMe').on('input', function () {
        var input = $(this);
        var re = /^[ a-zA-Z0-9_][a-zA-Z0-9_ ]*[a-zA-Z0-9_]$/;
        var is_about = re.test(input.val());
        if (is_about) {
          input.removeClass("invalid").addClass("valid");
          $('#userprofile-submit').prop('disabled', false);
          $('#aboutInvalid').hide();
        }
        else {
          input.removeClass("valid").addClass("invalid");
          $('#userprofile-submit').prop('disabled', true);
          $('#aboutInvalid').show();
        }
    });



        

});