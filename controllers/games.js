var Games = require("../dbmodels/Games");
var Users = require("../dbmodels/Users");

module.exports = {

    //*************************************************************************************************
    //Returns all the games
    //*************************************************************************************************

    getGames : function (req,res){
        Games.find({}).populate('creator_id').populate('players').exec(function(err, result){
            res.send(result);
        })
    },

    //*************************************************************************************************
    //Returns only the games that have not started
    //*************************************************************************************************

    getGamesNotStarted : function (req,res){
        Games.find({status: 1}).populate('creator_id').populate('players').exec(function(err, result){
            res.send(result);
        })
    },

    //*************************************************************************************************
    //Returns only the games that have started
    //*************************************************************************************************

    getGamesStarted : function (req,res){
        Games.find({}).populate('creator_id').populate('players').exec(function(err, result){
            res.send(result);
        })
    },

    //*************************************************************************************************
    //Returns only a particular game by its id
    //*************************************************************************************************

    getGameById : function (req,res){
        Games.findOne({_id: req.params._id}).populate('creator_id').populate('players').exec(function(err, result){
            res.send(result);
        })
    },

    //*************************************************************************************************
    //Creates a new game
    //2 possible cases:
    //- user is not logged in and the game is not added, returns error: -2
    //= user is logged in and the game is added and returned
    //*************************************************************************************************

    postGame : function(req,res){

        res.status(200);

        //Validate that the user is logged in
        Users.findOne({"$and": [{ username: req.body.username}, {password: req.body.password}]}).exec(function(err, result){

            if(result) {    //user is logged in so add the game

                req.body.turn = req.body.creator_id ;       //set by default to the creator of the game
                req.body.players = [req.body.creator_id] ;  //set by default one of the players to be the creator
                req.body.status = 1;                        //set the status of the game to 1 by default

                var game = new Games(req.body);
                game.save(function(err, data){

                    //populate after saving
                    data.populate('creator_id', function(err) {

                        data.populate('players', function(err) {
                            res.send(data);
                        });

                    });

                });

            } else {
                //console.log('Username is not logged in');
                res.send({error: -2});
            }

        });

    },

    //*************************************************************************************************
    //Joins a particular game
    //4 possible cases:
    //- user is not logged in and can't join the game, returns error: -2
    //- there are already enough players for this game, returns error: -3
    //- the player trying to join has already joined, returns error: -4
    //- user joins the game successfully, returns success: 1
    //*************************************************************************************************

    joinGame : function(req,res){

        res.status(200);

        //Validate that the user is logged in
        Users.findOne({"$and": [{ username: req.body.username}, {password: req.body.password}]}).exec(function(err, result){

            if(result) {    //user is logged in so proceed

                Games.findOne({_id: req.body.game_id}).populate('creator_id').exec(function(err, result){

                    //the game has enough players
                    if(result.players.length >= 2) {
                        res.send({error: -3});
                    } else {

                        //player has already joined
                        if(result.players.indexOf(req.body.user_id) >= 0) {
                            res.send({error: -4});
                        }

                        //update players in the game
                        res.send({success: 1});
                    }

                });

            } else {
                //console.log('Username is not logged in');
                res.send({error: -2});
            }

        });

    }

}
