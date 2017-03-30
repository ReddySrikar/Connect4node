var mongoose = require("mongoose");
var Games = require("../dbmodels/Games");
var Users = require("../dbmodels/Users");
var Schema = mongoose.Schema;

var moveSchema = new Schema({
    //_id: {type: String, required: true},
    createTime: { type: Date, default: Date.now },
    game_id: { type: Schema.Types.ObjectId, ref: 'Games' },
    user_id: { type: Schema.Types.ObjectId, ref: 'Users' },
    col_index: Number
});

module.exports = mongoose.model('Moves', moveSchema);
