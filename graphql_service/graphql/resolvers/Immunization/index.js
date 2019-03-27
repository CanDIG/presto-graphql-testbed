var ImmunizationModel = require('../../../models/immunization')
var moment = require('moment')

module.exports = {
    Query: {
        immunizations: async () => {
            var immunizations = await ImmunizationModel.find().limit(10)
            immunizations.map(o => (o.patient_id = o.patient.referenceid));
            if (!immunizations) {
                throw new Error('error while fetching data')
            }
            return immunizations 
        },
        immunizations_by_date: async (obj, args) => {
            var prev_date = moment().subtract(args.past_months, 'month').toISOString()
            var immunizations = await ImmunizationModel.find({"date.time": {$gte : prev_date}}).limit(10)
            immunizations.map(o => (o.patient_id = o.patient.referenceid));
            if (!immunizations) {
                throw new Error('error while fetching data')
            }
            return immunizations 
        }
    }
}