module.exports =  `
    type Date {
        time: String
        precision: String
    }
    type VaccineCode {
        text: String
        coding: [VaccineCoding]
    }
    type VaccineCoding {
        system: String
        code: String
        display: String
    }
    type Immunization {
        _id: String!
        date: Date
        patient_id: String!
        vaccineCode: VaccineCode
    }
    type Query {
        immunizations(limit: Int = 10): [Immunization]
        immunizations_by_date(past_months: Int!, limit: Int = 10): [Immunization]
    }
` 
