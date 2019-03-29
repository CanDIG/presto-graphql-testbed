#!/usr/bin/env python3

import snappy            # note; pip3 install python-snappy, not snappy.
import mysql.connector
from mysql.connector import errorcode
import numpy as np

HET_ALT = 1
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
                     "  PRIMARY KEY (`variant_id`, `sample_id`),"
                     "  CONSTRAINT `calls_varid` FOREIGN KEY (`variant_id`) REFERENCES variants(variant_id) ON DELETE CASCADE,",
                     "  CONSTRAINT `calls_sampid` FOREIGN KEY (`sample_id`) REFERENCES samples(sample_id) ON DELETE CASCADE",
                     ") ENGINE=InnoDB")

    index_commands = [("CREATE INDEX sample_idx on calls(`sample_id`)",),
                      ("CREATE INDEX var_idx on calls(`variant_id`)",)]

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


def populate_call_table(connection):
    """
    For each variant,
        For each sample that variant is called in,
            create an entry (variant_id, sample_id) in the CALLS table
    """
    samples_variants_cursor = connection.cursor(buffered=True)
    calls_cursor = connection.cursor()

    samples_query = ("SELECT sample_id FROM samples")
    samples_variants_cursor.execute(samples_query)
    sample_ids = [sid[0] for sid in samples_variants_cursor]


    add_call = ("INSERT INTO calls "
                "(variant_id, sample_id) "
                "VALUES (%s, %s)")

    variants_query = ("SELECT variant_id, gt_types FROM variants")
    samples_variants_cursor.execute(variants_query)

    valid_set = set([HET_ALT, HOM_ALT])

    for variant_id, gts, in samples_variants_cursor:
        full_gts = snappy_unpack_blob(gts)
        for (sample_id, gt) in zip(sample_ids, full_gts):
            if gt in valid_set:
                calls_cursor.execute(add_call, (variant_id, sample_id))
        
    calls_cursor.close()
    samples_variants_cursor.close()


if __name__ == "__main__":
    conn = mysql.connector.connect(host="localhost", user="dbuser", passwd="userpass", database="var_db", use_unicode=False)
    create_call_table(conn)
    populate_call_table(conn)
    conn.close()
