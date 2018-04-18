var mongoose = require('mongoose');

var GameSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  link: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
   condition: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});

var Game = mongoose.model('Game', GameSchema);
module.exports = Game;