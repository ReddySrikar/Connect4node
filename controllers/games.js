var Games = require("../dbmodels/Games");
var Users = require("../dbmodels/Users");

module.exports = {
    getGamesNotStarted : function (req,res){
    Games.find({status: 1}).exec(function(err, result){
        res.send(result);
        })
    },

    getGamesStarted : function (req,res){
    Games.find({}).exec(function(err, result){
        res.send(result);
        })
    },

    getGamesStartedByName : function (req,res){
    console.log("Game Id from params: "+req.params.name);
    Games.find({creator_id: req.params.name}).exec(function(err, result){
        res.send(result);
        })
    },

    getGameByGId : function (req,res){
    console.log("Game Id from params: "+req.params.g_id);
    Games.find({_id: req.params.g_id}).exec(function(err, result){
        res.send(result);
        })
    },

    getGamesNotStartedByCId : function (req,res){
    console.log("Creator Id from params to fetch game: "+req.params.cr_id);
    Games.find({creator_id: req.params.cr_id}).populate('creator_id').exec(function(err, result){
      console.log("Result is ", result);
      //game.creator = result;
      res.send(result);
    })
  },

    postGames : function(req,res){
    //console.log("games");
    //console.log(req.body);
    res.status(200);
    req.body.status = 1;
    var game = new Games(req.body);
    game.save(function(err, data){
      console.log(game);
      console.log('Game id is ' +game._id);
      Games.find({_id: game._id}).populate('creator_id').populate('players').exec(function(err, result){
        console.log("Result is ", result);
        //game.creator = result;
        res.send(result);
      })

    });

    /*
    userid, password, gameid*/

    //Users.find({_id: game.creator_id}).exec(function(err, result){
      //console.log("Result is "+result);
      //game.creator = result;
    //  res.send(game);
    //})
    //datab.collection("messages").insertOne(req.body);
  }
}
