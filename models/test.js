var mongoose = require('mongoose');

var TestSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  description: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  active: {
    type: Boolean,
    unique: false,
    required: true
  }
  ,
   img: {
    type: String,
    unique: false,
    required: true,
    trim: true
  },
  games: [{
    game: {type: mongoose.Schema.Types.ObjectId, ref: 'Game', required: true}
  }],
  results: [{
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    test_res: {type: Object, required: true},
    date: {type: Number, required: true}
  }]

});

var Test = mongoose.model('Test', TestSchema);
module.exports = Test;