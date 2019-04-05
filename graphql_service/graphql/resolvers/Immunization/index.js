var ImmunizationModel = require('../../../models/immunization')

module.exports = {
    Query: {
        immunizations: async (obj, args) => {
            var immunizations = await ImmunizationModel.find(args.limit)
            if (!immunizations) {
                throw new Error('error while fetching data')
            }
            return immunizations 
        },
        immunizations_by_date: async (obj, args) => {
            var immunizations = await ImmunizationModel.find_by_date(args.past_months, args.limit)
            if (!immunizations) {
                throw new Error('error while fetching data')
            }
            return immunizations 
        }
    }
}