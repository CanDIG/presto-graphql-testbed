module.exports =  `
    type Variant {
        variant_id: String!
        patient_ids: [String]
        chrom: String
        start: Int
        end: Int
        ref: String
        alt: String
        gene: String
        polyphen_score: Float
        af_exac_all: Float
    }
    type Query {
        variants(limit: Int = 10, patient_limit: Int = 10): [Variant]
    }
` 
