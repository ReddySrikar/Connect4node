var Users = require("../dbmodels/Users");

module.exports = {

    //*************************************************************************************************
    //Returns all the users in the users collection
    //*************************************************************************************************

    getUsers : function (req,res){

        Users.find({}).exec(function(err, result){
            res.send(result);
        })

    },

    //*************************************************************************************************
    //Returns one existing user from the users collection by its _id
    //*************************************************************************************************

    getUserById : function (req,res){

        Users.find({_id: req.params.id}).exec(function(err, result){
            res.send(result);
        })

    },

    //*************************************************************************************************
    //Creates a new user
    //2 possible cases:
    //- username already exists and user is not saved, returns error: -1
    //= user is saved and returned
    //*************************************************************************************************

    postUser : function(req,res){

        //Validate that the username is not taken already
        Users.find({username: req.body.username}).exec(function(err, authen){

            res.status(200);

            if(authen.length === 0){

                var user = new Users(req.body);
                user.save(function(err, data){
                    res.send(data); //.populate('token_id') - not necessary
                })

            } else {
                //console.log('Username already exists, Choose a new one!!');
                res.send({error: -1});
            }

        });

    },

    //*************************************************************************************************
    //Logs in an existing user or returns the proper response
    //3 possible cases:
    //- username not found, returns error: -1
    //- username found but password doesn't match, returns error: -2
    //- user found and returned
    //*************************************************************************************************

    loginUser : function(req, res){

        console.log("Verify Users", req.body.password);

        res.status(200);

        //Validate that user exists
        Users.findOne({username: req.body.username}).exec(function(err, exists){

            if(exists) {

                //Validate that the user is logged in
                Users.findOne({"$and": [{ username: req.body.username}, {password: req.body.password}]}).exec(function(err, result){

                    if(result) {
                        res.send(result);
                    } else {
                        //console.log('Username or Password does not match, PLEASE check your credentials!!');
                        res.send({error: -2});
                    }

                });

            } else {
                 //console.log('Username does not exist, PLEASE check your username!!');
                 res.send({error: -1});
            }

        });

    }

}
