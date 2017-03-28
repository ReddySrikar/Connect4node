var Users = require("../dbmodels/Users");

module.exports = {
    getUsers : function (req,res){
    Users.find({}).exec(function(err, result){
        res.send(result);
        })
    },
    getUserById : function (req,res){
    //console.log(req.body);
    console.log(req.params.id);
    Users.find({_id: req.params.id}).exec(function(err, result){
        res.send(result);
        })
    },

    postUsersBasic : function(req,res){
    console.log("users");
    console.log(req.body);
    res.status(200);
    var user = new Users(req.body);
    user.save(game);
    //datab.collection("messages").insertOne(req.body);
  },

    postUsers : function(req,res){
      console.log("users");
      console.log(req.body);
      var user = new Users(req.body);
      Users.find({username: req.body.username}).exec(function(err, authen){
        //console.log(authen);
        if(authen.length === 0){
          user.save(function(err, data){
            Users.find({_id: user._id}).populate('token_id').exec(function(err, result){
              res.status(200);
              res.send(result);
            })
          })
        } else {
          res.status(200);
          console.log('Username already exists, Choose a new one!!');
          res.send({error: -1});
        }
      });
    },

    /*loginUsers : function(req, res){
      console.log("Verify Users");
      var user = new Users(req.body);
      Users.find({username: user.username}).exec(function(err, login){
              console.log(login);
              Users.find("$and": [{ username: user.username}, {password: user.password}]), function(err, loginpass){
                loginpass.exec(function(err, result){
                res.status(200);
                res.send(result);

                  if(err){
                      console.log('Username or Password does not match, PLEASE check your credentials!!');
                      res.status(400);
                  }
                })
              }
      })

        if(err){
          console.log('Username does not exist, PLEASE check your username!!');
          res.status(400);
          res.send();
        }
      }*/

      /*loginUsers : function(req, res){
        console.log('Verify Users');
        var user = new Users(req.body);
        Users.find({username: user.username}).exec(function(err, unameit){
          console.log(unameit);
          if(unameit.length === 0){
            res.status(200);
            console.log('Username does not exist, PLEASE check your username!!');
            res.send({error: -1});
          }

        })
      }*/
}
