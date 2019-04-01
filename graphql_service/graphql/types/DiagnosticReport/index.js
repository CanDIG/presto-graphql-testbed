module.exports =  `
    type IssuedDate {
        time: String
        precision: String
    }
    type DiagnosticCode {
        coding: [DiagnosticCoding]
    }
    type DiagnosticCoding {
        system: String
        code: String
        display: String
    }
    type DiagnosticReport {
        _id: String!
        date: IssuedDate
        patient_id: String!
        code: DiagnosticCode
    }
    type Query {
        diagnostic_reports: [DiagnosticReport]
    }
` 
