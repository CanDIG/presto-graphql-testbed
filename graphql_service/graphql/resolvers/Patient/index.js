var PatientModel = require('../../../models/patient')

module.exports = {
    Query: {
        patients: async () => {
            const patients = await PatientModel.find()
            if (!patients) {
                throw new Error('error while fetching data')
            }
            return patients 
        },
        patients_by_name: async (obj, args) => {
            const patients = await PatientModel.find_by_name(args.name)
            if (!patients) {
                throw new Error('error while fetching data')
            }
            return patients
        }
    }
}