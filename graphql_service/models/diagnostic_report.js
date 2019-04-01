var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiagReportSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    issued: {
        time: String,
        precision: String
    },
    subject: {
        referenceid: String
    },
    code: {
        coding: [{
            system: String,
            code: String,
            display: String
        }]
    }
});
var DiagReportModel = mongoose.model('diagnosticreports', DiagReportSchema);
module.exports = DiagReportModel;