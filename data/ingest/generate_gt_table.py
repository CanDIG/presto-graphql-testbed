#!/usr/bin/env python3

import snappy            # note; pip3 install python-snappy, not snappy.
from pymongo import MongoClient
import mysql.connector
from mysql.connector import errorcode
import numpy as np

HOM_REF = 0
HET_ALT = 1
UNKNOWN = 2
HOM_ALT = 3


def try_create(cursor, cmd):
    """
    Try a cursor.execute(cmd) call, 
    wrapped in a try/execept block,
    catch "benign" errors, raise any others
    """
    ok_errors = [errorcode.ER_TABLE_EXISTS_ERROR,
                 errorcode.ER_DUP_INDEX,
                 errorcode.ER_DUP_KEY,
                 errorcode.ER_DUP_KEYNAME,]

    try:
        cursor.execute(cmd)
    except mysql.connector.Error as err:
        if err.errno in ok_errors:
            return
        raise(err)


def create_call_table(connection):
    """
    Create a table of calls
    An entry (variant_id, sample_id) exists if the sample is het or hom alt for that variant
    """
    table_command = ("CREATE TABLE `calls` ("
                     "  `variant_id` int(11) NOT NULL,"
                     "  `sample_id` int(11) NOT NULL,"
                     "  `patient_id` varchar(32),"
                     "  PRIMARY KEY (`variant_id`, `sample_id`),"
                     "  CONSTRAINT `calls_varid` FOREIGN KEY (`variant_id`) REFERENCES variants(variant_id) ON DELETE CASCADE,",
                     "  CONSTRAINT `calls_sampid` FOREIGN KEY (`sample_id`) REFERENCES samples(sample_id) ON DELETE CASCADE",
                     ") ENGINE=InnoDB")

    index_commands = [("CREATE INDEX sample_idx on calls(`sample_id`)",),
                      ("CREATE INDEX var_idx on calls(`variant_id`)",),
                      ("CREATE INDEX patient_idx on calls(`patient_id`)",)]

    cursor = connection.cursor()
    try_create(cursor, "".join(table_command))

    for idx_cmd in index_commands:
        try_create(cursor, "".join(idx_cmd))
    cursor.close()
    

def snappy_unpack_blob(blob):
    """
    Taken from https://github.com/arq5x/gemini/blob/master/gemini/compression.py
    """
    if len(blob) == 0:
        return None

    SEP = '\0'
    lookup = {dt(1).dtype.char: dt for dt in (np.uint8, np.uint32, np.int32,
              np.float32, np.int64, np.float64, np.bool_)}

    hdr_char = chr(blob[0])
    if hdr_char == 'S':
        return np.array(snappy.decompress(blob[1:]).split(SEP))

    dt = lookup[hdr_char]
    arr = np.frombuffer(snappy.decompress(blob[1:]), dtype=dt)
    return arr


def populate_call_table(connection, patient_ids):
    """
    For each variant,
        For each sample that variant is called in,
            create an entry (variant_id, sample_id) in the CALLS table
    """
    samples_cursor = connection.cursor()
    samples_query = ("SELECT sample_id FROM samples")
    samples_cursor.execute(samples_query)
    sample_ids = [sid[0] for sid in samples_cursor]
    samples_cursor.close()

    sample_map = {sid:pid for sid, pid in zip(sample_ids, patient_ids)}

    add_call = ("INSERT INTO calls "
                "(variant_id, sample_id, patient_id) "
                "VALUES (%s, %s, %s)")

    variants_cursor = connection.cursor(buffered=True)
    variants_query = ("SELECT variant_id, vcf_id, gt_types FROM variants")
    variants_cursor.execute(variants_query)
    rows = variants_cursor.fetchall()   # this isn't scalable
    variants_cursor.close()

    valid_set = set([HET_ALT, HOM_ALT])

    entries = []
    execute_batch_size = 100
    commit_batch_size = 1000

    tot = 0
    n_to_commit = 0
    calls_cursor = connection.cursor()

    for variant_id, vcf_id, gts, in rows:
        full_gts = snappy_unpack_blob(gts)
        nsamps = len([gt for gt in full_gts if gt in valid_set])

        for (sample_id, gt) in zip(sample_ids, full_gts):
            if gt in valid_set and sample_id in sample_map:
                entries.append((variant_id, sample_id, sample_map[sample_id]))
                if len(entries) >= execute_batch_size:
                    calls_cursor.executemany(add_call, entries)
                    n_to_commit += len(entries)
                    tot += len(entries)
                    entries = []

                    if n_to_commit >= commit_batch_size:
                        connection.commit()
                        n_to_commit = 0
                        print(tot)
                   
    if entries:
        calls_cursor.executemany(add_call, entries)
        connection.commit()

    calls_cursor.close()


def get_patient_ids(client):
    db = client['fhir']
    patient_ids = [record['_id'] for record in db.patients.find()]
    return patient_ids


if __name__ == "__main__":
    mysql_conn = mysql.connector.connect(host="localhost", user="dbuser", passwd="userpass", database="var_db", use_unicode=False)
    create_call_table(mysql_conn)

    mongo_client = MongoClient('mongodb://localhost:27017/')
    patient_ids = get_patient_ids(mongo_client)

    populate_call_table(mysql_conn, patient_ids)
    conn.close()
