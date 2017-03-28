var mongoose = require("mongoose");
var Users = require("../dbmodels/Users");
var Schema = mongoose.Schema;



var gameSchema = new Schema({name: String, creator_id: { type: Schema.Types.ObjectId, ref: 'Users' }, players: [{ type: Schema.Types.ObjectId, ref: 'Users' }], size_x: Number, size_y: Number, turn: String, winner: String, status: Number});
// status:: 1: Not started, 2: In progress, 3: Finished
module.exports = mongoose.model('Games', gameSchema);
