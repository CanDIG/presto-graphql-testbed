var DiagnosticReportModel = require('../../../models/diagnostic_report')

module.exports = {
    Query: {
        diagnostic_reports: async () => {
            var diagnostic_reports = await DiagnosticReportModel.find()
            if (!diagnostic_reports) {
                throw new Error('error while fetching data')
            }
            return diagnostic_reports 
        }
    }
}