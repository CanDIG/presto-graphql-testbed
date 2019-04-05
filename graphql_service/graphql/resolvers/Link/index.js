var ImmunizationModel = require('../../../models/immunization')
var PatientModel = require('../../../models/patient')
var DiagnosticReportModel = require('../../../models/diagnostic_report')

module.exports = {
    Patient: {
        immunizations: {
            fragment: '... on Patient { _id }',
            resolve: async (patient, args) => {
                const immunizations = await ImmunizationModel.find_by_patient_id(patient._id, args.limit);
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
                const patient = await PatientModel.find_by_id(immunization.patient_id);
                if (!patient) {
                    throw new Error('error while fetching data')
                }
                return patient 
            }
        }
    },
    DiagnosticReport: {
        patient: {
            fragment: '... on DiagnosticReport { patient_id }',
            resolve: async (diagnostic_report) => {
                const patient = await PatientModel.find_by_id(diagnostic_report.patient_id);
                if (!patient) {
                    throw new Error('error while fetching data')
                }
                return patient 
            }
        }
    },
    Variant: {
        patients: {
            fragment: '... on Variant { patient_ids }',
            resolve: async (variant, args) => {
                const patients = await PatientModel.find_by_ids(variant.patient_ids, args.limit);
                if (!patients) {
                    throw new Error('error while fetching data')
                }
                return patients
            }
        }
    }
}