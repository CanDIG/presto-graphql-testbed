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
databases.  See the README in the parent directory of this repository.  Note
that a change to the mongodb dump archive was performed to remove problematic
nested documents in the allergyintolerances, medicationrequests, patients, and
procedures collections in the fhir database.  The user should run mongorestore
on the "fixed" file:

```
cd data/ingest
tar xvfz mongodb_fhir_dump_fix.tgz
mongorestore dump
```



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

### Testing the database connections
Using the previous case for the MySQL database, we can run the same command
after connecting to the presto server using the client

```
presto> select count(*) from mysql.var_db.variants;
 _col0
-------
 19997
(1 row)

Query 20190425_113636_00012_45fmg, FINISHED, 1 node
Splits: 18 total, 18 done (100.00%)
0:03 [20K rows, 0B] [7.26K rows/s, 0B/s]
```

The MongoDB can be directly queried through Presto using SQL-like syntax.

```
presto> select count(*) from mongodb.fhir.immunizations;
 _col0
-------
 13189
(1 row)

Query 20190425_115119_00013_45fmg, FINISHED, 1 node
Splits: 18 total, 18 done (100.00%)
0:04 [13.2K rows, 901B] [3.4K rows/s, 232B/s]
```

With both databases available in the presto environment, we can perform queries
across both platforms.

```
WITH a AS (SELECT variant_id, patient_id FROM mysql.var_db.calls), b AS (SELECT code.text, subject.referenceid FROM mongodb.fhir.conditions), c AS (SELECT variant_id, chrom, start, ref, alt, gene, aa_change FROM mysql.var_db.variants), d AS (SELECT a.*, b.* FROM a JOIN b ON a.patient_id = b.referenceid) SELECT c.*, d.* FROM d JOIN c ON d.variant_id = c.variant_id;

 variant_id | chrom |  start   |          ref          |     alt     | gene | aa_change | variant_id |        patient_id        |                  text                   |       referenceid
------------+-------+----------+-----------------------+-------------+------+-----------+------------+--------------------------+-----------------------------------------+--------------------------
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Overlapping malignant neoplasm of colon | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Recurrent rectal polyp                  | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Polyp of colon                          | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Acute viral pharyngitis (disorder)      | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Acute viral pharyngitis (disorder)      | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Viral sinusitis (disorder)              | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Osteoporosis (disorder)                 | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Polyp of colon                          | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Prediabetes                             | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Epilepsy                                | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | History of single seizure (situation)   | 5c8518d9e24090000107787f
      18875 | 21    | 40497889 | T                     | C           | NULL | NULL      |      18875 | 5c8518d9e24090000107787f | Seizure disorder                        | 5c8518d9e24090000107787f
      18879 | 21    | 40499423 | G                     | T           | NULL | NULL      |      18879 | 5c8518d9e24090000107787f | Osteoarthritis of hip                   | 5c8518d9e24090000107787f
      18879 | 21    | 40499423 | G                     | T           | NULL | NULL      |      18879 | 5c8518d9e24090000107787f | Overlapping malignant neoplasm of colon | 5c8518d9e24090000107787f
```
