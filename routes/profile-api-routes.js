var db = require("../models");


module.exports = function (app, io) {



  app.post("/api/userProfiles", function (req, res) {
    db.UserProfile.create(req.body).then(function (data) {
      res.json(data);
    });
  });

  app.put("/api/userProfiles", function (req, res) {
    console.log("Inside put in route: " + req.body)
    db.UserProfile.update({
      status: req.body.status,
      socketID: req.body.socketID
    }, {
      where: {
        UserId: req.body.UserId
      }
    })
})





// Route for getting some data about our user to be used client side
app.get("/api/userProfiles", function (req, res) {
  db.UserProfile.findAll({}).then(function (data) {
    res.json(data);
  });
});
  
  };