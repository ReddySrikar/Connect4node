var mongoose = require("mongoose");

var tknSchema = new mongoose.Schema({name: String, description: String});
module.exports = mongoose.model('Tokens', tknSchema);
