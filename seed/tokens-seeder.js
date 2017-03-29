var Token = require("../dbmodels/Tokens");

var mongoose = require('mongoose');

mongoose.connect('localhost:27017/connect4');

var items = [
    new Token({
        name: 'token1',
        description: 'token clubs'
    }),
    new Token({
        name: 'token2',
        description: 'token spades'
    }),
    new Token({
        name: 'token3',
        description: 'token diamonds'
    }),
    new Token({
        name: 'token4',
        description: 'token hearts'
    }),
    new Token({
        name: 'token5',
        description: 'token blue'
    }),
    new Token({
        name: 'token6',
        description: 'token green'
    }),
    new Token({
        name: 'token7',
        description: 'token orange'
    }),
    new Token({
        name: 'token8',
        description: 'token red'
    }),
    new Token({
        name: 'token9',
        description: 'token white'
    }),
    new Token({
        name: 'token10',
        description: 'token yellow'
    })
];

var done = 0;
for (var i = 0; i < items.length; i++) {
    items[i].save(function(err, result) {
        done++;
        if (done === items.length) {
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}