# GraphQL/PRESTO testbed for clinical/genomic searches

![Block Diagram](diagram/diagram.png "Block Diagram")

This is a testbed containing a FHIR clinical data store (Synthetic Health's [GoFHIR](https://github.com/synthetichealth/gofhir)
running on top of MongoDB) and a simple Gemini-style variant database running MySQL, for testing GraphQL and Presto searching
across different types of data stores.  A diagram showing services and localhost port numbers is shown above.

This currently borrows heavily from https://github.com/medaymenTN/NodeJsGraphQLDockerApp .

## Requirments 

You will need docker and docker-compose installed on your machine.  In addition, to add the
test data to the services you will need local installs of mongodb and a mysql client.

## Installation 

* clone the project from the repo 
* cd -> project directory and run your project using the following command 
 ```
docker-compose up 
 ```

It will take a minute for the MongoDB to come up, and only after that will the front-end
services stop restarting as they can successfully connect to Mongo.
 
To load the clinical data (taken from the [Synthetic Mass](https://syntheticmass.mitre.org/download.html) 
subsample of 1000 synthetic patients), run the following:
```
cd data/ingest
tar -xzvf mongo_fhir_dump.tgz
mongorestore dump
```

From there, FHIR API searches should work such as:

Listing three patients:
```
curl "http://localhost:3001/Patient?_count=3" | jq
```

Showing all patients that have had a nasal endoscopy procedure (this one will take a few seconds):
```
curl "http://localhost:3001/Patient?_has:Procedure:patient:code=112790001" | jq
```

You can take a closer look at the MongoDB with the admin-mongo interface displayed on http://localhost:8082/.
Create a connection to `mongodb://mongo/fhir` with any name, then start the connection and examine the collections.

