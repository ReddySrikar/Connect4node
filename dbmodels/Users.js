var mongoose = require("mongoose");
var Tokens = require("../dbmodels/Tokens");
var Schema = mongoose.Schema;

var usrSchema = new Schema({username: String, password: String, email: String, token_id: { type: Schema.Types.ObjectId, ref: 'Tokens' }});
module.exports = mongoose.model('Users', usrSchema);
