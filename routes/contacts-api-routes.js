var db = require("../models");

module.exports = function(app) {
    app.post("/api/contacts", function(req, res){
        db.Contacts.create(req.body).then(function(dbContact){
            res.json(dbContact);
        })
    })
}