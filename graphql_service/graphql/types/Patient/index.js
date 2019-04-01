module.exports =  `
    type Name {
        use: [String]
        family: [String]
        given: [[String]]
        prefix: [[String]]
    }
    type BirthDate {
        time: String
    }
    type GeneralPractitioner {
        reference: [String]
    }
    type Patient {
        _id: String
        resourceType: String
        name: Name
        birthDate: BirthDate
        generalPractitioner: GeneralPractitioner
    }
    type Query {
        patients: [Patient]
        patients_by_name(name: String!): [Patient]
    }
` 
