var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema({
 
  res: [{
    test_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true},
    user_id: {}
  }]



});

var Result = mongoose.model('Result', ResultSchema);
module.exports = Result;