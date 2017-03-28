var app = require('express')();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

//var mongo = require("mongodb").MongoClient;
var mongoose = require("mongoose");


//var auth = require("./controllers/auth");
var tokens = require("./controllers/tokens");
var users = require("./controllers/users");
var games = require("./controllers/games");

var jwt = require("jwt-simple");

mongoose.Promise = require('bluebird');
//var datab;

app.use(bodyParser.json());

app.get('/', function(req, res){
  res.send('Hello World!');
});

app.get("/api/tokens", tokens.getTokens);

app.post("/api/tokens", tokens.postTokens);

app.get("/api/users/:id", users.getUserById);

app.post("/api/users", users.postUsers);

app.post("/api/login/", users.loginUsers);

app.get("/api/gamesns", games.getGamesNotStarted);

app.get("/api/gamesns/creator/:cr_id", games.getGamesNotStartedByCId);

app.get("/api/gamesns/games/:g_id", games.getGameByGId);

app.get("/api/gamesns/games/name/:cr_id", games.getGamesStartedByName);

//app.post("/api/games", games.postGames);

app.post("/api/games", games.postGames);

mongoose.connect("mongodb://localhost:27017/connect4", function(err,db){
    if(!err){
        console.log("Connection to MongoDB: Successful");
        //datab = db;
        //GetMessages();
    }
    else
        console.log("Connection to MongoDB: Failed");
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;

  console.log('Listening at http://%s:%s', host, port);
});
