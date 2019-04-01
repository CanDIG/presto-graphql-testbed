var DiagnosticReportModel = require('../../../models/diagnostic_report')

module.exports = {
    Query: {
        diagnostic_reports: async () => {
            var diagnostic_reports = await DiagnosticReportModel.find().limit(10)
            diagnostic_reports.map(o => (o.patient_id = o.subject.referenceid));
            if (!diagnostic_reports) {
                throw new Error('error while fetching data')
            }
            return diagnostic_reports 
        }
    }
}