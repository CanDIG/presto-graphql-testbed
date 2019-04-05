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
// module.exports = DiagReportModel;

exports.find = async () => {
    var diagnostic_reports = await DiagReportModel.find().limit(10)
    diagnostic_reports.map(o => (o.patient_id = o.subject.referenceid));
    return diagnostic_reports
}