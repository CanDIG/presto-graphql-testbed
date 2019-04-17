# GraphQL Service

A graphql service that facilitates queries over FHIR resources and the mySQL variant database
`https://graphql.org/`

## Understanding the Parts

The graphQL service has a certain workflow with how requests are processed and the essentially there are 3 things that make up a simple query. The three things are the `model`, the `type`, and the `resolver`. I use `graphql-tools` to help 

### Model (./model)

The model is essentially the connector to the database, this is the component where you directly communicate with your database either by using javascript libraries like `mongoose` or `mysql`, or by calling REST APIs. The model should return JSON values that have keys and values that you want to show in your graphql query. 

### Type (./graphql/types)

The type is essentially a schema that dictates the response object and graphQL query format. There are many types in a graphQL service and each type has it's own unique name (Similar to unique collections/tables within a database). 


`Note`: the keys within the types schema AUTOAMTICALLY map to the keys in the JSON response from the data model. Therefore it is important to format your response from the database in a particular way so it can match your schema.


There are certain times where you have a nested object (or an object within an object), and similarly with types, you can easily nest types within types. This functionality can be used to make "joins" across different databases by "Linking" the different types together. This can be seen in the (./graphql/types/link) directory, where you can see some types being extended


Finally, there is a query type which can take parameters and essentially is a gateway where you dictate the input and output of types. There is also another type called mutation, but you can read more about that by yourself.

```
https://www.apollographql.com/docs/graphql-tools/generate-schema
```

### Resolver (./graphql/resolvers)

The resolver, like the name suggest is a function that `resolves` the types. Usually the resolver is used to resolve the query by calling upon the data model to access the database. Resolvers can also be used to resolve types without a definition from your model (eg. you have want to add a field that does not exist in your model). This functionality is also used when Linking different types together.

```
https://www.apollographql.com/docs/graphql-tools/resolvers
```


## Workflow and Organization

The workflow and organization is largely based on the directory structures. Within `./types` and `./resolvers`, there are different subdirectories that represent the objects within the service. Within the subdirectory (eg. `./types/Patient`), there is an `index.js` file that contains the type or resolver of that particular object.  So back into the parent directory, both `./types/index.js` and `./resolvers/index.js`, merge their respective types or resolvers into one larger type or resolver. Finally, the types and resovlers are merged into a single schema in the `./graphql/index.js` which is then served in `./server.js`.


Two graphql libraries are used extensively to achieve this, one being `graphql-tools` and the other being `merge-graphql-schemas`. 


If you want to try building your own service in a similar fashion, you can follow this guide: `https://medium.com/the-ideal-system/graphql-and-mongodb-a-quick-example-34643e637e49`.

## Building on this App

### Adding a new object with a simple query

1. Create a model that can return a JSON response
2. Create a folder for the object within `./types` and create an `index.js` file within that folder
3. Add the schema in the `./types/{OBJECT_NAME}/index.js` file you just created (NOTE: Add a query type to be able to query it)
4. Attach the new type in the `./types/index.js` file
5. Create a folder for the object within `./resolvers` and create an `index.js` file within that folder
6. Add a resolver for the query type you created in step 3
7. Add the new resolver in `./resolvers/index.js` file

### Adding a Query

1. Go in the `./types` folder and find an object you want to query
2. Go into the `index.js` file of the object folder and add a Query within the query type
3. Go in the `./resolvers` folder and find the object's resolver and add a resolver function that matches the name of the query you added

### Linking 2 Objects

1. Go in the `./types/Link/index.js` file and add extend the type you want to extend and add the key and value(object to be extended) within the extended type
2. Go in the `./resolvers/Link/index.js` and resolve the function

You can look at some more info on linking in: `https://www.apollographql.com/docs/graphql-tools/schema-stitching`


