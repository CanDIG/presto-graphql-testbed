module.exports =  `
    type Date {
        time: String
        precision: String
    }
    type Immunization_Patient {
        reference: String
        referenceid: String
    }
    type Immunization {
        _id: String!
        date: Date
        patient_id: String!
    }
    type Query {
        immunizations: [Immunization]
        immunizations_by_date(past_months: Int!): [Immunization]
    }
` 
