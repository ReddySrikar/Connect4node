var Tokens = require("../dbmodels/Tokens");

module.exports = {

    getTokens : function (req,res){
        Tokens.find({}).exec(function(err, result){
            res.send(result);
        })
    },

    postToken : function(req,res){
        var token = new Tokens(req.body);
        token.save();
    }

}
