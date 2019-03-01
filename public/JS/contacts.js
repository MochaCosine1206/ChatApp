$(document).ready(function () {




    $.get("/api/userProfiles", function (data) {
        console.log("Users ", data);
        let contacts = data;
        var rowsToAdd = [];
        for (var i = 0; i < contacts.length; i++) {
            rowsToAdd.push(createContactRow(data[i]));
        }
        renderContactList(rowsToAdd);
        nameInput.val("");

    });
});

