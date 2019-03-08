var db = require("../models");

module.exports = function(app) {
    app.post("/api/chatStart", function(req, res){
        db.Chats.create(req.body).then(function(dbChats){
            res.json(dbChats);
        })
    })

    app.post("/api/chatStart", function(req, res){
        db.Chats.create(req.body).then(function (data) {
            res.json(data);
          });
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

    app.get("/api/chatStartdistinct/", function(req, res){
        db.Chats.findAll({group: ['ChatID']}).then(function (data) {
            console.log("inside distinct call " + data)
            res.json(data);
          });
    })
}