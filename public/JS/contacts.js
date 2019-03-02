$(document).ready(function () {

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
            newContactCard.css({
                borderTop: "solid 1px grey",
                height: "50px",
                backgroundColor: "white"
            });
            const newContactCardAvatar = $("<img>").attr("src", contact.avatar_seed);
            newContactCardAvatar.addClass("img-thumbnail");
            newContactCardAvatar.css({
                height: "50px"
            })
            newContactCard.text(contact.userName);
            // var newContactCardConnected use this when created.  When user connects on socket, status will change.
            newContactCard.text(" " + contact.name + " | " + contact.userName + " | " + contact.tagline);
            newContactCard.prepend(newContactCardAvatar);
            return newContactCard;
        }


});

