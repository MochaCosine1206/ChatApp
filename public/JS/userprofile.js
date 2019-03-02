

$(document).ready(function () {
    const profileForm = $("#userInfo")
    const nameInput = $("#name");
    const usernameInput = $("#userName");
    const userAbout = $("#userAboutMe");
    const userAvatar = $("#avatarImg");
    // const ioTestDev = $('#ioTestDev');
    let seed = Math.floor(Math.random() * 5001);
    let avatarURL = "https://avatars.dicebear.com/v2/jdenticon/:" + seed + ".svg"
    // let socket = io.connect();






    //use custom avatar image for new profile

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function (data) {
        $(".member-name").text(data.email);
    });

    userAvatar.attr("src", avatarURL)

    //below is socket demo for future reference

    // nameInput.keyup(function(){
    //     socket.emit('send profile', nameInput.val());
    //     socket.on('return name', function(data){
    //         ioTestDev.text(data.msg);
    //        })
    // })



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
            tagline: tagline
            }).then(getProfileData);
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

        

});