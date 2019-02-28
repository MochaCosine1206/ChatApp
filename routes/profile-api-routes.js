var db = require("../models");


module.exports = function(app, io) {

    

    app.post("/api/userProfiles", function(req, res) {
      console.log(req.body);
      db.UserProfile.create({
        name: req.body.name,
        userName: req.body.userName,
        avatar_seed: req.body.avatar_seed,
        aboutMe: req.body.about_me,
      }).then(function() {
        res.json("/chats");
      }).catch(function(err) {
        console.log(err);
        res.json(err);
        // res.status(422).json(err.errors[0].message);
      });
    });
  

  
    // Route for getting some data about our user to be used client side
    app.get("/api/userProfiles", function(req, res) {
      if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
      }
      else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
          name: req.body.name,
          userName: req.body.userName,
          avatar_seed: req.body.avatar_seed,
          aboutMe: req.body.about_me,
        });
      }
    });
  
  };