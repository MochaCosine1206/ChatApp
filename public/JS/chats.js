$(document).ready(function () {

    let socket = io();

    const contactsCard = $("#contactsCard");
    chatStart = $("#chatStart");
    contactSearch = $("#contactSearch")
    let contacts;
    let currentUser = "";
    let contactButtonArr = [];
    let contactNameArr = [];
    let contactIdArr = [];
    let userSocketID = "";
    let chatRoomID = "";

    $.get("/api/user_data").then(function (data) {
        currentUser = data.id
        setUserStatus(userSocketID, currentUser);
    });


    socket.on('connect', function () {
        userSocketID = socket.id;
        console.log("Your Socket ID is " + userSocketID);
    })

    // socket.on('disconnect', function(reason){
    //     userSocketID = null;
    //     console.log("Socket Disconnected: " + reason);
    //     setUserStatus(userSocketID, currentUser)
    // })





    function setUserStatus(userSocketID, currentUser) {
        if (!userSocketID) {
            let userStatusData = {
                UserId: currentUser,
                status: false,
                socketID: userSocketID
            }
            updateProfileStatus(userStatusData)
        } else {
            let userStatusData = {
                UserId: currentUser,
                status: true,
                socketID: userSocketID
            }
            updateProfileStatus(userStatusData)
        }
    }

    function updateProfileStatus(userStatusData) {
        $.ajax({
            method: "PUT",
            url: "/api/userProfiles",
            data: userStatusData
        })
    }



    //Clicking this button opens up the user selection pane
    $("#chatbutton").click(function () {
        chatStart.toggle();
        getContacts();
        //Clear Contacts
    })


    function updateProfileStatus(userStatusData) {
        $.ajax({
            method: "PUT",
            url: "/api/userProfiles",
            data: userStatusData
        })
    }


    function getContacts() {
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
    }


    //function to create rows
    function initializeRows(contacts) {

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
        const newChatCard = $("<div>");
        newChatCard.attr("class", "contactCard");
        newChatCard.attr("addedToChat", "no");
        newChatCard.attr("contactID", contact.id);
        newChatCard.attr("contactUser", contact.userName);
        newChatCard.attr("contactName", contact.name);
        newChatCard.data("contact", contact);
        const newContactCardText = $("<div>");
        newContactCardText.css({
            marginTop: "10px"
        })
        newChatCard.css({
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
        newChatCard.append(newContactCardAvatar);
        newChatCard.append(newContactCardText, newContactCardTagline);
        return newChatCard;
    }
    //function to create buttons
    function contactSelect() {
        let contactCard = $('.contactCard');
        let contactSelectButtons = $('#contactSelectButtons');
        contactCard.on("click", function () {
            let contactState = $(this).attr('addedToChat');
            let contactStateId = $(this).attr('contactID');
            let contactStateUser = $(this).attr('contactUser');
            let contactStateName = $(this).attr('contactName');

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

                //create object of new Contact
                let newContact = {
                    UserID: currentUser,
                    UserProfileId: contactStateId
                }
                //add to button
                // contactPickButton.data(newContact);

                //append to div
                contactSelectButtons.append(contactPickButton);






                //push contact to array to add to chatgroups
                contactButtonArr.push(newContact);
                contactNameArr.push(contactStateName);
                contactIdArr.push(contactStateId)
                let contactButtonIndex = contactButtonArr.indexOf(newContact);
                contactSelectButtons.attr("buttonIndex", contactButtonIndex)
                console.log(contactButtonIndex)
                console.log(contactButtonArr);



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

                var removefromSelection = $(this).parent().parent("button").attr("buttonIndex");
                var buttonIndex = contactButtonArr[removefromSelection];
                if (buttonIndex !== -1) {
                    console.log(removefromSelection);
                    contactButtonArr.splice(buttonIndex, 1);
                }

                console.log(contactButtonArr);
            })





        })

        $("#chatSelectButton").on("click", function () {
            //when button is clicked, userProfileIDs will be sent to create new Chat at one Chat ID //need to push userID's to an array.
            chatRoomID = contactNameArr.join(", ")
            console.log("ChatRoomID: " + chatRoomID)
            //add contact
            for (let i = 0; i < contactButtonArr.length; i++) {
                submitContact(contactButtonArr[i]);
            }
            //create Chat Group
            for (let i = 0; i < contactIdArr.length; i++) {
                var newMessageGroup = {
                    chatID: chatRoomID,
                    UserProfileId: contactIdArr[i]
                }
                console.log("User IDs from the chats submittal: " + contactIdArr[i] )
                submitChatGroup(newMessageGroup)
            }
            
            setUpChat(contactIdArr, chatRoomID)
        })

        function submitContact(newContact) {
            $.post("api/chatGroup", newContact)
        }

        function submitChatGroup(newChatGroup) {
            $.post("api/chatStart", newChatGroup)
        }

        function setUpChat(contactIdArr, chatRoomID) {
            console.log("inside setupchat" + contactIdArr, chatRoomID);
            //change selected cards back to white
            //change attributes of selected divs back to normal state
            $(".contactCard").css({
                backgroundColor: "white",
            }).attr("addedToChat", "no")
            //clear selection div
            contactsCard.empty();
            $('#contactSelectButtons').empty();
            //get chatRoom Name
            let chatRoomName = chatRoomID
            //get last item in chat
            $.get("/api/chatStart/" + chatRoomName).then(function (data) {
                chats = data
                console.log(chats)

                initializeChatGroups(chats);
            });

            //Create new div for these cards to go in
            function initializeChatGroups(chats) {
                let chatGroupArea = $('#chatGroupDiv')
                //empty div first
                chatGroupArea.empty();
                //array to hold objects
                var chatgroupsToAdd = [];
                for (var i = 0; i < chats.length; i++) {
                    //push data to create dev for each item
                    chatgroupsToAdd.push(createNewRow(chats[i]));
                    console.log(chats[i]);
                    console.log(chatgroupsToAdd);
                }
                //append the created items to main div
                chatGroupArea.append(chatgroupsToAdd);
                //function to choose a selection
            }


            //make card, apply class,add attributes
            //get time of last item in chat and convert to days ago
            //contact card creation
            function createNewRow(chat) {
                let numberOfUsers = chat.chatID.split(", ").length
                console.log("inside CreateNewRow: chat length" + numberOfUsers)
                const newChatCard = $("<div>");
                newChatCard.addClass("card")
                const numMembers = $("<div>");
                numMembers.text(numberOfUsers);//not working
                const chatName = $('<div>');
                chatName.addClass("card-title")
                chatName.text(chat.chatID);
                newChatCard.append(numMembers, chatName)
                return newChatCard;
            }
            //Create div for messages to go in
            //add submit button to input
            //on submit, message goes to chats
            //socket.io gets message, time, and name
            //display oldest first in chat "window"

            //when new chat group is created or selected
            //chat window clears, and new chat is loaded
        }

    }
    setUpChat()
});

