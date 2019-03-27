module.exports =  `
    type Variant {
        variant_id: String!
        chrom: String
        start: Int
        end: Int
        ref: String
        alt: String
    }
    type Query {
        variants: [Variant]
    }
` 
