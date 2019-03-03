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


    $.get("/api/user_data").then(function (data) {
        currentUser = data.id
    });

    $("#chatbutton").click(function () {
        chatStart.toggle();
    })







    $.get("api/userProfiles").then(function (data) {
        console.log(data);
        contacts = data
        console.log("inside get call: " + contacts[0].name);
        if (!contacts || !contacts.length) {
            contactsCard.text("Nobody's home!")
        } else {
            initializeRows(contacts);
        }
    });


    function initializeRows(contacts) {
        let searchphrase = "";
        contactSearch.keyup(function () {
            searchphrase = (contactSearch.val())
        })


        contactsCard.empty();
        var contactsToAdd = [];
        for (var i = 0; i < contacts.length; i++) {
            contactsToAdd.push(createNewRow(contacts[i]));
            console.log(contacts[i]);
            console.log(contactsToAdd);
        }
        contactsCard.append(contactsToAdd);

        contactSelect();
    }

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

    function contactSelect() {
        let contactCard = $('.contactCard');
        let contactSearch = $('#contactSearch');
        let contactPickButton = $('<button>');
        contactPickButton.addClass("btn mr-3");
        contactPickButton.css({
            backgroundColor: "lightblue"
        });
        contactCard.on("click", function () {
            let contactState = $(this).attr('addedToChat');
            let contactStateId = $(this).attr('contactID');
            let contactStateUser = $(this).attr('contactUser');
            if (contactState === 'no') {
                $(this).css({
                    backgroundColor: "lightblue",
                }).attr('addedToChat', 'yes');
                contactPickButton.attr("contactId", contactStateId)
                contactSearch.val(contactStateUser);
                var newContact = {
                    ContactId: currentUser,
                    UserProfileId: contactStateId
                    
                }
                submitContact(newContact);
            } else {
                $(this).css({
                    backgroundColor: "white",
                }).attr('addedToChat', 'no');
                contactPickButton.attr("contactId", contactStateId)
            }
        })
    }

    function submitContact(newContact) {
        $.post("api/contacts", newContact)
    }


});

