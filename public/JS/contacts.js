$(document).ready(function () {


    $.get("api/userProfiles").then(function (data) {
        console.log(data);
        console.log(res.body);
        });
});

