module.exports =  `
    extend type Patient {
        immunizations: [Immunization]
    }
    extend type Immunization {
        patient: Patient
    }
    extend type DiagnosticReport {
        patient: Patient
    }
` 
