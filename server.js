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

//app.get('/', function(req, res){
//  res.send('Hello World!');
//});

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile(__dirname + '/public/index.html');
});

app.get("/api/tokens", tokens.getTokens);

app.post("/api/token/create", tokens.postToken);

app.get("/api/user/:id", users.getUserById);

app.get("/api/users", users.getUsers);

app.post("/api/user/create", users.postUser);

app.post("/api/login/", users.loginUser);

app.get("/api/games", games.getGames);

app.get("/api/gamesns", games.getGamesNotStarted);

app.get("/api/gamesns/games/:g_id", games.getGameById);

app.post("/api/game/create", games.postGame);

app.post("/api/game/join", games.joinGame);

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
