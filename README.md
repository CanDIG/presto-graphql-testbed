# FHIR/CanvasDB testbed

Borrows heavily in the beinning from https://github.com/medaymenTN/NodeJsGraphQLDockerApp

## Requirments 

you should have docker and docker-compose installed on your machine 

## installation 

* clone the project from the repo 
* cd -> project directory and run your project using the following command 
 ```
docker-compose up 
 ```
 your node js project will run on http://localhost:4000/graphql
 
 * admin-mongo interface will be displayed on http://localhost:8082/
 
 * add a random name to your connection and in the field connection string put the following connection string 
 (mongodb://mongo/myappdb)

```
cd data/ingest
tar -xzvf mongo_fhir_dump.tgz
mongorestore dump
```

curl "http://localhost:3001/Patient?_count=3" | jq

curl "http://localhost:3001/Patient?_has:Procedure:patient:code=112790001" | jq
