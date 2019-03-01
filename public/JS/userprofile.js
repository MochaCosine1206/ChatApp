// import io from 'socket.io-client';

$(document).ready(function () {
    const profileForm = $("#userInfo")
    const nameInput = $("#name");
    const usernameInput = $("#userName");
    const userAbout = $("textarea#userAboutMe");
    const userAvatar = $("#avatarImg");
    let seed = Math.floor(Math.random() * 5001);
    let avatarURL = "https://avatars.dicebear.com/v2/jdenticon/:" + seed + ".svg"


    

    //use custom avatar image for new profile

    // This file just does a GET request to figure out which user is logged in
    // and updates the HTML on the page
    $.get("/api/user_data").then(function (data) {
        $(".member-name").text(data.email);
    });

    userAvatar.attr("src", avatarURL)



    profileForm.on("submit", function (event) {
        event.preventDefault();
        console.log("You pressed the Submit Button");
        console.log("Name: " + nameInput + " username: " + userName + " avatarURL: " + avatarURL + " About Me: " + userAbout)

        console.log(JSON.stringify(userAbout))

        let profileData = {
            name: nameInput.val().trim(),
            userName: usernameInput.val().trim(),
            avatar_seed: avatarURL,
            about_me: userAbout.val()
        }

        if (!profileData.name || !profileData.userName) {
            return;
        }

        addUserProfile(profileData.name, profileData.userName, profileData.avatar_seed, profileData.about_me);

        nameInput.val("");
        usernameInput.val("");
        userAbout.val("");

        function addUserProfile(name, userName, avatar_seed, about_me) {
            $.post("api/userProfiles", {
            name: name,
            userName: userName,
            avatar_seed: avatar_seed,
            about_me: about_me
            }).then(function(data) {
                window.location.replace(data);
            }).catch(handleLoginErr);
        }

        
        $.get("api/userProfiles").then(function (data) {
            console.log(data);
        });
    });

    function handleLoginErr(err) {
        $("#alert .msg").text(err.responseJSON);
        $("#alert").fadeIn(500);
      }
});