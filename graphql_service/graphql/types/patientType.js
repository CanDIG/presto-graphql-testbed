var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLDate = require('graphql-date')

var nameType = new GraphQLObjectType({
    name: 'name',
    fields: () => {
        return{
            use: {
                type: GraphQLList(GraphQLString)
            },
            family: {
                type: GraphQLList(GraphQLString)
            },
            given: {
                type: GraphQLList(GraphQLList(GraphQLString))
            },
            prefix: {
                type: GraphQLList(GraphQLList(GraphQLString))
            },
        }
    }
});



// Book Type
exports.patientType = new GraphQLObjectType({
  name: 'patient',
  fields:  () =>{
    return {
      _id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      resourceType: {
        type: GraphQLString
      },
      name: {
        type: nameType
      },
      birthDate: {
        type: new GraphQLObjectType({
            name: 'birthDate',
            fields: () => {
                return{
                    time: {
                        type: GraphQLDate
                    }
                }
            }
        })
      },
      generalPractitioner: {
        type: new GraphQLObjectType({
            name: 'generalPractitioner',
            fields: () => {
                return{
                    reference: {
                        type: GraphQLList(GraphQLString)
                    }
                }
            }
        })
      }
    }
  }
});


