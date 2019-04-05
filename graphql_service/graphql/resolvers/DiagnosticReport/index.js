var DiagnosticReportModel = require('../../../models/diagnostic_report')

module.exports = {
    Query: {
        diagnostic_reports: async (obj, args) => {
            var diagnostic_reports = await DiagnosticReportModel.find(args.limit)
            if (!diagnostic_reports) {
                throw new Error('error while fetching data')
            }
            return diagnostic_reports 
        }
    }
}