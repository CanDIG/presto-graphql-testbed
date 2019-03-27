var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClaimsSchema = new Schema({
  resourceType: {
    type: String,
    required: true
  },
  meta: {
    lastUpdated:{
        time: {
            type:String,
            required:true
        },
        precision: {
            type:String,
            required:true
        }
    }
  }

});
var ClaimModel = mongoose.model('claims', ClaimsSchema);
module.exports = ClaimModel;