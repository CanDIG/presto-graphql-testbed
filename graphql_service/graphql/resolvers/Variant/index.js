var VariantModel = require('../../../models/variant')

module.exports = {
    Query: {
        variants: async() => {
            const variants = await VariantModel.find()
            if (!variants) {
                throw new Error('error while fetching data')
            }
            return variants 
        }
    }
}