var mergeTypes = require("merge-graphql-schemas").mergeTypes

var patient = require("./Patient")
var immunization = require("./Immunization")
var link = require("./Link")
var variant = require("./Variant")

const typeDefs = [patient, immunization, link, variant]



module.exports = mergeTypes(typeDefs);
// NOTE: 2nd param is optional, and defaults to false
// Only use if you have defined the same type multiple times in
// different files and wish to attempt merging them together.
// export default mergeTypes(typeDefs, { all: true });

