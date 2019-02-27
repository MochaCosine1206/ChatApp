
$(document).ready(function () {


    const nameInput = $("#name");
    const usernameInput = $("#userName");
    const userAbout = $("#userAboutMe");
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

  

    $(document).on("submit", "#userInfo", handleProfileFormSubmit);


    function handleProfileFormSubmit(event) {
        event.preventDefault();
        // Don't do anything if the fields haven't been filled out
        if (!nameInput.val().trim().trim()) {
            return;
        }

        if (!usernameInput.val().trim().trim()) {
            return;
        }

        if (!userAbout.val().trim().trim()) {
            return;
        }
        // Calling the updateProfile function and passing in the value of the name input
        updateProfile({
            name: nameInput.val().trim(),
            userName: usernameInput.val().trim(),
            avatar_seed: avatarURL,
        });
    }

    // A function for creating a user Profile.
    function updateProfile(profileData) {
        $.post("/api/userProfiles", profileData);
    }

});