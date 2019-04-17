var mergeResolvers = require("merge-graphql-schemas").mergeResolvers
var patient = require('./Patient')
var immunization = require('./Immunization')
var link = require('./Link')
var variant = require('./Variant')
var diagnostic_report = require('./DiagnosticReport')

var resolvers = [patient, immunization, link, variant, diagnostic_report];

module.exports = mergeResolvers(resolvers);