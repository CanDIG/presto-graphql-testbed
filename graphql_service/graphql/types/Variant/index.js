module.exports =  `
    type Variant {
        variant_id: String!
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
        variants: [Variant]
    }
` 
