var Games = require("../dbmodels/Games");
var Users = require("../dbmodels/Users");
var Moves = require("../dbmodels/Moves");

module.exports = {

    //*************************************************************************************************
    //Returns all the games
    //*************************************************************************************************

    getGames : function (req,res){
        Games.find({status: 1}).populate('creator_id').populate('players').exec(function(err, result){
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
    //- user joins the game successfully, returns game obj
    //*************************************************************************************************

    joinGame : function(req,res){

        res.status(200);

        //Validate that the user is logged in
        Users.findOne({"$and": [{ username: req.body.username}, {password: req.body.password}]}).exec(function(err, result){

            if(result) {    //user is logged in so proceed

                Games.findOne({_id: req.body.game_id}).populate('creator_id').exec(function(err, data){

                    //the game has enough players
                    if(data.players.length >= 2) {
                        res.send({error: -3});
                    } else {

                        //player has already joined
                        if(data.players.indexOf(req.body.user_id) >= 0) {

                            res.send({error: -4});

                        } else {

                            //update players in the game
                            data.players.push(req.body.user_id);
                            data.save(function(err, game) {
                                game.populate('players', function(err) {
                                    res.send(game);
                                });
                            });

                        }

                    }

                });

            } else {
                //console.log('Username is not logged in');
                res.send({error: -2});
            }

        });

    },

    //*************************************************************************************************
    //Starts a particular game
    //4 possible cases:
    //- user is not logged in and can't start the game, returns error: -2
    //- the game doesn't exist or is already started or finished, returns error: -3
    //- user is not the creator of the game and can't start the game, returns error: -4
    //- user starts the game successfully, returns game obj
    //*************************************************************************************************

    startGame : function(req,res){

        res.status(200);

        //Validate that the user is logged in
        Users.findOne({"$and": [{ username: req.body.username}, {password: req.body.password}]}).exec(function(err, user){

            if(user) {    //user is logged in so proceed

                Games.findOne({_id: req.body.game_id}).populate('creator_id').exec(function(err, game){

                    if(game) {

                        if(game.status != 1) {

                            res.send({error: -3});

                        }

                        //validate the game creator is the user who wants to start the game
                        if(game.creator_id._id.toString() === user._id.toString()) {

                            //update players in the game
                            game.status = 2;
                            game.save(function(err, game) {
                                game.populate('players', function(err) {
                                    res.send(game);
                                });
                            });

                        } else {

                            res.send({error: -4});

                        }

                    } else {

                        res.send({error: -3});

                    }

                });

            } else {
                //console.log('Username is not logged in');
                res.send({error: -2});
            }

        });

    },

    //*************************************************************************************************
    //Make a move on a particular game
    //6 possible cases:
    //- user is not logged in and can't move, returns error: -2
    //- the game couldn't be found, returns error: -3
    //- the player is trying to cheat it is not the players turn, returns error: -4
    //- invalid move, the move is either out of the board or on a filled up column: -5
    //- the player has moved successfully, returns success: 1
    //- the player has moved successfully and won, returns success: 2
    //*************************************************************************************************

    makeMoveOnGame : function(req,res){

        res.status(200);

        //Validate that the user is logged in
        Users.findOne({"$and": [{ username: req.body.username}, {password: req.body.password}]}).exec(function(err, user){

            if(user) {    //user is logged in so proceed

                Games.findOne({"$and": [{ _id: req.body.game_id }, { status: 2 }]}).populate('creator_id').exec(function(err, game){

                    //validate the game exists
                    if(game) {

                        //validate it is this players turn
                        if(game.turn.toString() === user._id.toString()) {

                            var col_ind = parseInt(req.body.col_index),
                                row_ind = 1,
                                r_inds = [],
                                game_id = game._id,
                                user_id = user._id.toString(),
                                board = initGameBoard(game.size_x, game.size_y);

                            Moves.find({game_id: game_id}).sort({'createTime': 'asc'}).populate('game_id').populate('user_id').exec(function(err, past_moves){

                                //fill up the board
                                for(var i=0; i<past_moves.length; i++) {

                                    var c_ind = past_moves[i].col_index;

                                    //update the proper row index for the column
                                    r_inds[c_ind-1] = r_inds[c_ind-1] >= 0 ? r_inds[c_ind-1] + 1 : 0;

                                    //update the board cell
                                    if(!board[c_ind-1]) { board[c_ind-1] = []; }
                                    board[c_ind-1][r_inds[c_ind-1]] = past_moves[i].user_id._id;

                                    //count the number of tokens in the column related to the move
                                    if(c_ind === col_ind) {
                                        row_ind++;
                                    }

                                }

                                //check if the move is invalid
                                if(game.size_x < col_ind || col_ind < 1 || game.size_y < row_ind || row_ind < 1) {
                                    res.send({error: -5});
                                    return;
                                }

                                //update the board with the new move
                                board[col_ind-1][row_ind-1] = user_id;

                                //insert the new move
                                var move = new Moves({ game_id: game._id, user_id: user_id, col_index: col_ind });
                                move.save(function(err, data){

                                    //get next turn id
                                    var len = game.players.length,
                                        next_turn_user_id;

                                    for(var i=0; i<len; i++) {
                                        if(game.players[i] == user_id) {
                                            if(i + 1 < len) { next_turn_user_id = game.players[i+1]; }
                                            else { next_turn_user_id = game.players[0]; }
                                        }
                                    }

                                    //update game's next turn
                                    game.turn = next_turn_user_id;
                                    game.save(function(err, game) {

                                        //check for victory
                                        if(checkVictory(board, game.size_x, game.size_y, col_ind-1, row_ind-1, user_id)) {

                                            //update game victory and status
                                            game.winner = user_id;
                                            game.status = 3;
                                            game.save(function(err, game) {
                                                res.send({success: 1, turn: next_turn_user_id});
                                            });

                                        } else if(checkDraw(board, game.size_x, game.size_y)) {

                                            //update game victory and status
                                            game.winner = 'DRAW';
                                            game.status = 3;
                                            game.save(function(err, game) {
                                                res.send({success: 2, turn: next_turn_user_id});
                                            });

                                        } else {
                                            res.send(next_turn_user_id);
                                        }

                                        //populate after saving
                                        /*data.populate('game_id', function(err) {

                                            data.populate('user_id', function(err) {
                                                res.send(data);
                                            });

                                        });*/

                                    });

                                });

                            });

                        } else {
                            //not this players turn
                            res.send({error: -4});
                        }

                    } else {
                        //game doesn't exist
                        res.send({error: -3});
                    }

                });

            } else {
                //console.log('Username is not logged in');
                res.send({error: -2});
            }

        });

    }

}

//*************************************************************************************************
//Initializes the board of the game for a particular board size and returns it
//*************************************************************************************************

function initGameBoard(x, y){

    var board = [];

    //create the board
    for(var i=0; i<x; i++) {

        var col = [];

        for(var k=0; k<y; k++) {

            col.push(0);

        }

        board.push(col);

    }

    return board;

}

//*************************************************************************************************
//Checks if a player has won
//*************************************************************************************************

function checkVictory(board, x, y, col, row, user_id) {

    var res,
        r,
        c;

    //check col
    res = 0;
    for(var i=0; i<y; i++) {
        if(board[col][i] == user_id){ res++; } else { res = 0; }
        if(res === 4) { return true; }
    }

    //check row
    res = 0;
    for(var i=0; i<x; i++) {
        if(board[i][row] == user_id){ res++; } else { res = 0; }
        if(res === 4) { return true; }
    }

    //check diagonal tilted to right
    res = 0;
    r = row, c = col;
    //get to start point
    while(r > y-1 && c < x-1) {
        r++;
        c++;
    }

    while(r >= 0 && c >= 0) {
        if(board[c][r] == user_id){ res++; } else { res = 0; }
        if(res === 4) { return true; }
        r--;
        c--;
    }

    //check diagonal tilted to left
    res = 0;
    r = row, c = col;
    //get to start point
    while(r > 0 && c < 0) {
        r--;
        c--;
    }

    while(r <= y-1 && c <= x-1) {
        if(board[c][r] == user_id){ res++; } else { res = 0; }
        if(res === 4) { return true; }
        r++;
        c++;
    }

    return false;

}

//*************************************************************************************************
//Checks if the game is a draw
//*************************************************************************************************

function checkDraw(board, x, y){

    //create the board
    for(var i=0; i<x; i++) {

        for(var k=0; k<y; k++) {

            if(board[i][k] === 0) { return false; }

        }

    }

    return true;

}