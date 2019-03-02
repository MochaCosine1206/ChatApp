var db = require("../models");


module.exports = function(app, io) {

    

    app.post("/api/userProfiles", function(req, res) {
      db.UserProfile.create(req.body).then(function(data) {
        res.json(data);
      });
    });
  

  
    // Route for getting some data about our user to be used client side
    app.get("/api/userProfiles", function(req, res) {
      db.UserProfile.findAll({}).then(function(data) {
        res.json(data);
      });
    });
  
  };