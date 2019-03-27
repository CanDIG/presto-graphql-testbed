var ImmunizationModel = require('../../../models/immunization')
var PatientModel = require('../../../models/patient')

module.exports = {
    Patient: {
        immunizations: {
            fragment: '... on Patient { _id }',
            resolve: async (patient) => {
                const immunizations = await ImmunizationModel.find({"patient.referenceid": patient._id }).limit(10)
                if (!immunizations) {
                    throw new Error('error while fetching data')
                }
                return immunizations 
            }
        }
    },
    Immunization: {
        patient: {
            fragment: '... on Immunization { patient_id }',
            resolve: async (immunization) => {
                const patient = await PatientModel.findOne({"_id": immunization.patient_id})
                if (!patient) {
                    throw new Error('error while fetching data')
                }
                return patient 
            }
        }
    }
}