var mergeResolvers = require("merge-graphql-schemas").mergeResolvers
var patient = require('./Patient')
var immunization = require('./Immunization')
var link = require('./Link')
var variant = require('./Variant')

var resolvers = [patient, immunization, link, variant];

module.exports = mergeResolvers(resolvers);