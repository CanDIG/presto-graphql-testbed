var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PatientSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    resourceType: {
        type: String,
        required: true
    },
    name: {
        use: {
            type:String,
            required:true
        },
        family: {
            type:String,
            required:true
        },
        given: [String],
        prefix: [String]
    },
    birthDate: {
        time: Date
    },
    generalPractitioner: {
        reference: {
            type: String,
            required: true
        }
    }

});
var PatientModel = mongoose.model('patients', PatientSchema);
module.exports = PatientModel;