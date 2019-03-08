

$(document).ready(function () {



    let socket = io();

    const contactsCard = $("#contactsCard");
    let chatStart = $("#chatStart");
    // let contactSearch = $("#contactSearch");
    let chatMessageArea = $("#messageArea")
    let thisUser;
    let contactState;
    let contactStateId;
    let contactStateName;
    let contactStateUser;
    let contacts;
    let chatRoomName;
    let currentUser = "";
    var contactsToAdd = [];
    let contactButtonArr = [];
    let contactNameArr = [];
    let contactIdArr = [];
    // let userSocketID = "";
    let chatRoomID = "";
    let room = "";
    let thisName = "";

    function getUserInfo() {
        $.get("/api/user_data").then(function (data) {
            currentUser = data.id
            // setUserStatus(userSocketID, currentUser);
            setCurrentProfileUser()
        });
    }



    // socket.on('connect', function () {
    //     userSocketID = socket.id;
    //     console.log("Your Socket ID is " + userSocketID);
    // })

    // socket.on('disconnect', function(reason){
    //     userSocketID = null;
    //     console.log("Socket Disconnected: " + reason);
    //     setUserStatus(userSocketID, currentUser)
    // })

    function setCurrentProfileUser() {

        $.get("api/userProfiles/" + currentUser).then(function (data) {
            contactNameArr = [];
            console.log(contactNameArr);

            console.log(data[0].id);
            thisUser = data[0].id;
            thisName = data[0].name;
            console.log("this user is: " + thisUser);
            contactIdArr.push(thisUser)
            contactNameArr.push(thisName)
            console.log(contactIdArr + " " + contactNameArr)

            //Get userprofile ID to use to post messages to chat table
            getContacts(thisUser)

        });
    }



    // function setUserStatus(userSocketID, currentUser) {
    //     if (!userSocketID) {
    //         let userStatusData = {
    //             UserId: currentUser,
    //             status: false,
    //             socketID: userSocketID
    //         }
    //         updateProfileStatus(userStatusData)
    //     } else {
    //         let userStatusData = {
    //             UserId: currentUser,
    //             status: true,
    //             socketID: userSocketID
    //         }
    //         updateProfileStatus(userStatusData)
    //     }
    // }

    // function updateProfileStatus(userStatusData) {
    //     $.ajax({
    //         method: "PUT",
    //         url: "/api/userProfiles",
    //         data: userStatusData
    //     })
    // }



    //Clicking this button opens up the user selection pane
    $("#chatbutton").click(function () {

        chatStart.toggle();
        $("#chatStartBack").toggle();
        if ($("#contactsCard").is(":visible")) {
            console.log("visible");

        } else {
            console.log("hidden")
            contactsCard.show();
        }
    })




    function getContacts(thisUser) {
        //retreive user profile information
        console.log("inside get contacts")
        $.get("api/userProfiles").then(function (data) {
            console.log(data);
            contacts = data
            console.log("inside get call: " + contacts[0].name);
            if (!contacts || !contacts.length) {
                contactsCard.text("Nobody's home!")
            } else {
                //begin using contact data to create row information
                initializeRows(contacts, thisUser);
            }
        });
    }


    //function to create rows
    function initializeRows(contacts, thisUser) {
        console.log("Inside initialize Rows, contacts length: " + contacts)
        //empty div first
        contactsCard.empty();
        //array to hold objects

        console.log("before contacts loop")
        for (var i = 0; i < contacts.length; i++) {
            console.log(contacts[i].id + " " + thisUser)
            if (contacts[i].id !== thisUser) {
                console.log("looping number: " + contacts.length)
                //push data to create dev for each item
                contactsToAdd.push(createNewRow(contacts[i]));
                console.log(contacts[i]);
                console.log(contactsToAdd);
            }

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
        console.log("inside ContactSelect")
        let contactCard = $('.contactCard');
        let contactSelectButtons = $('#contactSelectButtons');
        contactCard.on("click", function () {
            contactState = $(this).attr('addedToChat');
            contactStateId = $(this).attr('contactID');
            contactStateName = $(this).attr('contactName');
            contactStateUser = $(this).attr('contactUser')

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
                console.log(contactNameArr);
                contactNameArr.push(contactStateName);
                console.log("seeing if all names here" + contactNameArr)
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
                console.log(contactNameArr);
                contactButtonArr.pop();
                contactNameArr.pop();
                contactIdArr.pop();
            }
            closeTag(contactStateUser);
        })

    }

    function closeTag(contactStateUser) {
        $("i").on("click", function () {
            contactButtonArr.pop();
            contactNameArr.pop();
            contactIdArr.pop();
            $(this).parent().parent("button").remove(":contains(" + contactStateUser + ")");
            console.log("contactStateUser: " + contactStateUser)
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
    }



    $("#chatSelectButton").on("click", function () {
        event.preventDefault();
        //when button is clicked, userProfileIDs will be sent to create new Chat at one Chat ID //need to push userID's to an array.
        chatRoomID = contactNameArr.join(", ")
        var newMessageGroup;
        console.log("ChatRoomID: " + chatRoomID)
        //add contact
        for (let i = 0; i < contactButtonArr.length; i++) {
            submitContact(contactButtonArr[i]);
        }
        //create Chat Group
        for (let i = 0; i < contactIdArr.length; i++) {
            newMessageGroup = {
                chatID: chatRoomID,
                UserProfileId: contactIdArr[i]
            }
            console.log("User IDs from the chats submittal: " + contactIdArr[i])

        }
        submitChatGroup(newMessageGroup)


    })

    function submitContact(newContact) {
        $.post("api/chatGroup", newContact)
    }

    function submitChatGroup(newChatGroup) {
        $.post("api/chatStart", newChatGroup)
        setUpChat(contactIdArr, chatRoomID)
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
        contactsToAdd = [];
        chatStart.toggle();
        $('#contactSelectButtons').hide();
        //get chatRoom Name
        chatRoomName = chatRoomID
        location.reload();
    }

    //Create new div for these cards to go in
    function initializeChatGroups(chats) {
        let chatGroupArea = $('#chatGroupDiv')
        //empty div first
        chatGroupArea.empty();
        //array to hold objects
        let chatgroupsToAdd = [];
        $.get("api/userProfiles/" + currentUser).then(function (data) {
            thisName = data[0].name;
                for (var i = 0; i < chats.length; i++) {
                    if(chats[i].chatID !== null) {
                        if (chats[i].chatID.indexOf(thisName) >=0 ) {
                            //if this name is in the chatID, do not create card
                            //push data to create dev for each item
                            chatgroupsToAdd.push(createNewChatRow(chats[i]));
                            console.log(chats[i]);
                            console.log(chatgroupsToAdd);
                        }
                        chatGroupArea.append(chatgroupsToAdd);
                    }

            }
       

        let chatGroupCard = $(".chatGroupCardId")
        chatGroupCard.click(function () {
            console.log("you clicked!")
            room = $(this).attr("chatRoom");
            console.log("The room is: " + room);
            socket.emit("room", room);
            socket.emit("userMessage", room);

        })
        console.log(contactNameArr);
        contactIdArr = [];

    });
        //append the created items to main div
        
        //function to choose a selection

        //--Get Click Events from Card Groups
        

    }

    socket.on('message', function (data) {
        console.log('incoming message: ', data);

    })

    socket.on('room', function (data) {
        chatRoomName = data;
        //get chatinfo
    })

    socket.on('userMessage', function () {
        console.log("this isthe chatroom: " + chatRoomName)
        $.get("/api/chatStart/" + chatRoomName).then(function (data) {
            chats = data
            console.log("Chatroom info fired from socket" + chats)
            messageStream(chats);
        });
    })


    function messageStream(chatdata) {

        console.log("insideMessageStream")


        chatMessageArea[0].scrollTop = chatMessageArea[0].scrollHeight;
        chatMessageArea.empty();
        thisUserName = "";
        for (let i = 0; i < chatdata.length; i++) {
            if (chatdata[i].message !== null) {
                let messageDiv = $("<div>");
                messageDiv.css({
                    lineHeight: "23px",
                    padding: "10px",
                    borderTop: "1px solid grey"
                })
                let messageTextDiv = $('<div>');
                let messageTextTopRow = $('<div>');
                messageTextTopRow.addClass("row");
                let messageTextBottomRow = $('<div>');
                messageTextBottomRow.addClass("row");
                messageTextDiv.addClass("col 6");
                messageTextDiv.attr("id", "messageSender")
                messageTextDiv.text(chatdata[i].message);
                let messageTimeDiv = $('<div>');
                messageTimeDiv.addClass("col 10")
                messageTimeDiv.attr("id", "messageTime")
                let messageNameDiv = $('<div>');
                messageNameDiv.attr("id", "messageNameDiv")
                messageNameDiv.addClass("col-md-auto")
                messageNameDiv.text(chatdata[i].UserName);
                messageNameDiv.css({
                    color: "black"
                })
                messageTimeDiv.text(moment(chatdata[i].createdAt).fromNow())
                messageTextTopRow.append(messageNameDiv, messageTimeDiv);
                messageTextBottomRow.append(messageTextDiv)
                messageDiv.append(messageTextTopRow, messageTextBottomRow)
                chatMessageArea.append(messageDiv);
                chatMessageArea[0].scrollTop = chatMessageArea[0].scrollHeight;
            }

        }

    }

    //make card, apply class,add attributes
    //get time of last item in chat and convert to days ago
    //contact card creation
    function createNewChatRow(chat) {
        if (chat.chatID) {
            console.log("chat before error" + chat.chatID)
            let numberOfUsers = chat.chatID.split(", ").length
            console.log("inside CreateNewRow: chat length" + numberOfUsers)
            const newChatCard = $("<div>");
            newChatCard.addClass("card mb-3 chatGroupCardId");
            const newChatCardRow = $("<div>");
            newChatCardRow.addClass("row no-gutters");
            const newChatCardRowCol1 = $("<div>");
            newChatCardRowCol1.addClass("col-md-4  text-center");
            newChatCardRowCol1.attr("id", "cardLeftColumn")
            const newChatCardRowCol2 = $("<div>");
            newChatCardRowCol2.addClass("col-md-8");
            const newChatCardBody = $('<div>');
            newChatCardBody.addClass("card-body");
            const newChatCardBody2 = $('<div>');
            newChatCardBody2.addClass("card-body");
            newChatCard.attr("chatRoom", chat.chatID)
            const numMembers = $("<div>");
            numMembers.attr("id", "numMembers")
            numMembers.text(numberOfUsers);
            numMembers.css({
                top: "50%"
            })
            const chatName = $('<h6>');
            chatName.addClass("card-title")
            chatName.text(chat.chatID);
            newChatCardBody2.append(numMembers)
            newChatCardRowCol1.append(newChatCardBody2);
            newChatCardBody.append(chatName);
            newChatCardRowCol2.append(newChatCardBody)
            newChatCardRow.append(newChatCardRowCol1, newChatCardRowCol2);
            newChatCard.append(newChatCardRow)

            return newChatCard;
        } else {
            console.log("There was a null value")
        }

    }
    //Create div for messages to go in
    //add submit button to input
    //on submit, message goes to chats
    //socket.io gets message, time, and name
    //display oldest first in chat "window"

    //when new chat group is created or selected
    //chat window clears, and new chat is loaded


    getUserInfo();

    getChats();

    function getChats() {
        $.get("/api/chatStartdistinct/").then(function (data) {
            chats = data
            if (chats) {
                console.log("Inside Chat Start: " + chats)
                initializeChatGroups(chats);
            } else {
                console.log("No Chats created yet!")
            }
        });
    }


    //set up room based on Chat ID name to get chat data by oldest first at the ChatRoom Name by oldest first

    //--Get Input from message Text Box
    $(function () {
        $('#chatInput').keypress(function (e) {
            if (e.which == 13 && !e.shiftKey) {

                console.log($(this).val())
                let message = $(this).val()
                submitMessage(message, thisUser, thisName)
                $(this).val("");
                socket.emit("userMessage", room);
            }
        })

        $("#messageSubmit").click(function () {
            event.preventDefault();
            socket.emit("userMessage");
            console.log($('#chatInput').val())
            let message = $('#chatInput').val()
            submitMessage(message, thisUser, thisName)
            
            socket.emit("userMessage", room);
            $("#chatInput").val("");
        })
    })



    


    function submitMessage(message, thisUser, thisName) {
        console.log("Inside submit message " + thisUser)
        console.log("Inside submit Message: " + thisName)
        $.post("/api/chatStart", {
            chatID: chatRoomName,
            message: message,
            UserProfileId: thisUser,
            UserName: thisName
        }).then(function (data) {
            messages = data
            console.log(messages)
        });
    }

});

