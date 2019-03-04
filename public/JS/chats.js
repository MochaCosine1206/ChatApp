$(document).ready(function () {

    let socket = io.connect();


    //below is socket demo for future reference

    // nameInput.keyup(function(){
    //     socket.emit('send profile', nameInput.val());
    //     socket.on('return name', function(data){
    //         ioTestDev.text(data.msg);
    //        })
    // })

    const contactsCard = $("#contactsCard");
    chatStart = $("#chatStart");
    contactSearch = $("#contactSearch")
    let contacts;
    let currentUser = "";



    //retrieve user is from Users table
    $.get("/api/user_data").then(function (data) {
        currentUser = data.id
    });

    //Clicking this button opens up the user selection pane
    $("#chatbutton").click(function () {
        chatStart.toggle();
    })






    //retreive user profile information
    $.get("api/userProfiles").then(function (data) {
        console.log(data);
        contacts = data
        console.log("inside get call: " + contacts[0].name);
        if (!contacts || !contacts.length) {
            contactsCard.text("Nobody's home!")
        } else {
            //begin using contact data to create row information
            initializeRows(contacts);
        }
    });

    //function to create rows
    function initializeRows(contacts) {
        let searchphrase = "";
        contactSearch.keyup(function () {
            searchphrase = (contactSearch.val())
        })

        //empty div first
        contactsCard.empty();
        //array to hold objects
        var contactsToAdd = [];
        for (var i = 0; i < contacts.length; i++) {
            //push data to create dev for each item
            contactsToAdd.push(createNewRow(contacts[i]));
            console.log(contacts[i]);
            console.log(contactsToAdd);
        }
        //append the created items to main div
        contactsCard.append(contactsToAdd);
        //function to choose a selection
        contactSelect();
    }
    //contact card creation
    function createNewRow(contact) {
        console.log("inside CreateNewRow: " + contact)
        const newContactCard = $("<div>");
        newContactCard.attr("class", "contactCard");
        newContactCard.attr("addedToChat", "no");
        newContactCard.attr("contactID", contact.id);
        newContactCard.attr("contactUser", contact.userName);
        newContactCard.data("contact", contact);
        const newContactCardText = $("<div>");
        newContactCardText.css({
            marginTop: "10px"
        })
        newContactCard.css({
            borderTop: "solid 1px grey",
            height: "70px",
            backgroundColor: "white",
            padding: "3px",
        });
        const newContactCardAvatar = $("<img>").attr("src", contact.avatar_seed);
        const newContactCardTagline = $("<div>").text(contact.tagline);
        newContactCardTagline.css({
            fontSize: "12px"
        })
        newContactCardAvatar.addClass("img-thumbnail");
        newContactCardAvatar.css({
            height: "60px",
            float: "left",
            marginRight: "3px"
        })
        // var newContactCardConnected use this when created.  When user connects on socket, status will change.
        newContactCardText.text(" " + contact.name + " | " + contact.userName);
        newContactCard.append(newContactCardAvatar);
        newContactCard.append(newContactCardText, newContactCardTagline);
        return newContactCard;
    }
    //function to create buttons
    function contactSelect() {
        let contactCard = $('.contactCard');
        let contactSelectButtons = $('#contactSelectButtons');

        let contactButtonArr = [];
        contactCard.on("click", function () {
            let contactState = $(this).attr('addedToChat');
            let contactStateId = $(this).attr('contactID');
            let contactStateUser = $(this).attr('contactUser');

            //if the contact is not selected, make it so
            if (contactState === 'no') {
                $(this).css({
                    backgroundColor: "lightblue",
                }).attr('addedToChat', 'yes');
                let contactPickButton = $('<button>');
                contactPickButton.addClass("btn mr-3");
                contactPickButton.css({
                    backgroundColor: "lightblue"
                });
                contactPickButton.attr("contactId", contactStateId)
                contactPickButton.html("<span>" + contactStateUser + "  <i class='far fa-times-circle'></i></span>");


                contactSelectButtons.append(contactPickButton);


                //create object of new Contact
                var newContact = {
                    ContactId: currentUser,
                    UserProfileId: contactStateId
                }

                //post chosedn contacts to the contacts DB
                submitContact(newContact);

                //if the contact is already selected and the user wants to deselect
            } else {
                $(this).css({
                    backgroundColor: "white",
                }).attr('addedToChat', 'no');
                $("button").remove(":contains(" + contactStateUser + ")")
            }

            $("i").on("click", function () {
                $(this).parent().parent("button").remove(":contains(" + contactStateUser + ")");
                //change connected div back
                $("#contactsCard").find(":contains(" + contactStateUser + ")").parent().css({
                    backgroundColor: "white",
                })
                $("#contactsCard").find(":contains(" + contactStateUser + ")").attr('addedToChat', 'no');
                })

        })

        $("#chatSelectButton").on("click", function(){
            //when button is clicked, userProfileIDs will be sent to create new Chat at one Chat ID
        })

        function submitContact(newContact) {
            $.post("api/contacts", newContact)
        }

        function submitChatGroup(newChatGroup) {
            $.post("api/chatGroup", newChatGroup)
        }
    }

});

