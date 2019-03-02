$(document).ready(function () {

    let socket = io.connect('http://localhost:8080');

    const contactsCard = $("#contactsCard");
    let contacts;


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
            contactsCard.empty();
            var contactsToAdd = [];
            for (var i = 0; i < contacts.length; i++) {
                contactsToAdd.push(createNewRow(contacts[i]));
                console.log(contacts[i]);
                console.log(contactsToAdd);
            }
            contactsCard.append(contactsToAdd);
        }

        function createNewRow(contact) {
            console.log("inside CreateNewRow: " + contact)
            const newContactCard = $("<div>");
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


});

