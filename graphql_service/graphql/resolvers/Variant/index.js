var VariantModel = require('../../../models/variant')

module.exports = {
    Query: {
        variants: async(obj, args) => {
            const variants = await VariantModel.find(args.limit, args.patient_limit)
            if (!variants) {
                throw new Error('error while fetching data')
            }
            return variants 
        }
    }
}