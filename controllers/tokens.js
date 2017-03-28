var Tokens = require("../dbmodels/Tokens");

module.exports = {
    getTokens : function (req,res){
    Tokens.find({}).exec(function(err, result){
        res.send(result);
        })
    },

    postTokens : function(req,res){
    console.log("reqbody");
    console.log(req.body);
    res.status(200);
    var token = new Tokens(req.body);
    token.save();
    //datab.collection("messages").insertOne(req.body);
  }
}
