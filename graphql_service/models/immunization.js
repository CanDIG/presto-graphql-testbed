var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImmunizationSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    date:{
        time:{
            type: Date,
            required: true
        },
        precision:{
            type: String,
            required: true
        }
    },
    patient: {
        reference:{
            type: String,
            required: true
        },
        referenceid: {
            type:String,
            required: true
        },
        external: {
            type: Boolean,
            required: true
        }

    },
    vaccineCode: {
        coding: [{
            system: String,
            code: String,
            display: String
        }],
        text: String
    }

});
var ImmunizationModel = mongoose.model('immunizations', ImmunizationSchema);
module.exports = ImmunizationModel;