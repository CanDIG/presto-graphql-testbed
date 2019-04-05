var mysqlx = require('@mysql/xdevapi')
var options = {
  host: "mysql",
  user: "root",
  password: "rootpass",
  port: "33060",
  schema: 'var_db' // an error is thrown if it does not exist
};

// searches first 5 variants and returns it
exports.find = () => {
    return new Promise((resolve) => {
        var cols = ['v.variant_id', 'c.patient_id', 'v.vcf_id', 'v.chrom', 'v.start', 'v.end', 'v.ref', 'v.alt', 'v.gene' ,'v.polyphen_score', 'v.af_exac_all'];
        var col_str = cols.join(', ');
        mysqlx.getSession(options)
            .then(async (session) => {
                var variants = {};
                // Selects first 10 unique variant_ids
                await session.sql(
                `select ${col_str} from variants as v
                left join calls as c on v.variant_id = c.variant_id
                inner join (select distinct variant_id from variants order by variant_id limit 2) s on s.variant_id = v.variant_id
                order by v.variant_id`).execute((row) => {
                    var var_id = row[0].toString()
                    cols.forEach((key, i) => {
                        var col_name = key.split('.')[1];
                        if (variants[var_id] == undefined) variants[var_id] = {}
                        if (col_name == 'patient_id') {
                            col_name = 'patient_ids'
                            // Adds a limit filter here
                            if (!(variants[var_id][col_name] != undefined && variants[var_id][col_name].length > 10))
                                (variants[var_id][col_name] == undefined) ? variants[var_id][col_name] = [row[i]] : variants[var_id][col_name].push(row[i]);
                        } else {
                            variants[var_id][col_name] = row[i];
                        }
                    });
                });
                resolve(Object.values(variants));
                
            }).catch(function(error) {
                console.log(error);
                throw error;
            });
    });
}

exports.find()