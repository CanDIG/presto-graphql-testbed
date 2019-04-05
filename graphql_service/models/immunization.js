var mongoose = require('mongoose');
var moment = require('moment')
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
// module.exports = ImmunizationModel;

exports.find = async () => {
    var immunizations = await ImmunizationModel.find().limit(10)
    immunizations.map(o => (o.patient_id = o.patient.referenceid));
    return immunizations
}

exports.find_by_patient_id = async (patient_id) => {
    var immunizations = await ImmunizationModel.find({"patient.referenceid": patient_id }).limit(10)
    immunizations.map(o => (o.patient_id = o.patient.referenceid));
    return immunizations
}

exports.find_by_date = async (past_months) => {
    var prev_date = moment().subtract(past_months, 'month').toISOString()
    var immunizations = await ImmunizationModel.find({"date.time": {$gte : prev_date}}).limit(10)
    immunizations.map(o => (o.patient_id = o.patient.referenceid));
    return immunizations
}