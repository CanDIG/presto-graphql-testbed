# presto_service

The `presto_service` module provides configuration files and setup instructions
to use PrestoDB with the MySQL and MongoDB databases from the test environment
created by Jonathan Dursi.


## Installation
### Presto server Docker setup 
The Docker container image is setup through the parent `docker-compose`
configuration file.  Connectors for MySQL and MongoDB have been created with the
docker-compose configuration in mind and will require changes to the host
information.

To get the entire container environment running, run the following command:

```
docker-compose up
```

Additional steps are required to get the data into each of the MySQL and MongoDB
databases.  See the README in the parent directory of this repository.



### Presto client setup
The Presto client link is available in the documentation link below:
```
https://prestodb.github.io/docs/current/installation/cli.html
```

After downloading the client and changing permissions to make it executable, you
can start the client by running:

```
/path/to/client/presto --server localhost:8080
```

