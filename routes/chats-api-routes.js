var db = require("../models");

module.exports = function(app) {
    app.post("/api/chatStart", function(req, res){
        db.Chats.create(req.body).then(function(dbChats){
            res.json(dbChats);
        })
    })

    app.get("/api/chatStart/", function(req, res){
        db.Chats.findAll({}).then(function (data) {
            res.json(data);
          });
    })

    app.get("/api/chatStart/:roomName", function(req, res){
        db.Chats.findAll({
            where: {
                chatID: req.params.roomName
            }
        }).then(function (data) {
            res.json(data);
          });
    })
}