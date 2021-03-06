// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require('express');
var session = require("express-session");
var passport = require("./config/passport");
var socketEvents = require('./socketEvents');



// Sets up the Express App
// =============================================================

var PORT = process.env.PORT || 8080;

// Requiring our models for syncing
var db = require("./models");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.attach(http)

socketEvents(io);

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
app.use(express.static("public"));
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());






// Routes
// =============================================================
require("./routes/html-routes-api")(app);
require("./routes/register-api-routes")(app);
require("./routes/profile-api-routes")(app);
require("./routes/chatGroup-api-routes")(app);
require("./routes/chats-api-routes")(app);


// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync().then(function () {
  http.listen(PORT, function () {
    console.log("==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.", PORT, PORT);
  });
});

// { force: true }
