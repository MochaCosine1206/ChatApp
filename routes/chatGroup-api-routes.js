var db = require("../models");

module.exports = function(app) {
    app.post("/api/chatGroup", function(req, res){
        db.ChatGroups.create(req.body).then(function(dbChatGroup){
            res.json(dbChatGroup);
        })
    })
}