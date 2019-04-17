module.exports =  `
    extend type Patient {
        immunizations(limit: Int = 10): [Immunization]
    }
    extend type Immunization {
        patient: Patient
    }
    extend type DiagnosticReport {
        patient: Patient
    }
    extend type Variant {
        patients(limit: Int = 10): [Patient]
    }
` 
