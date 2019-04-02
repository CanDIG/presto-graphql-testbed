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
    return new Promise(resolve => {
        var variants = [];
        var cols = ['variant_id', 'vcf_id', 'chrom', 'start', 'end', 'ref', 'alt', 'gene' ,'polyphen_score', 'af_exac_all'];
        var col_str = cols.join(', ');
        mysqlx.getSession(options)
            .then(function (session) {
                session.sql('select ' + col_str + ' from variants limit 10').execute(function(row) {
                    row_json = {}
                    cols.forEach((key, i) => row_json[key] = row[i]);
                    variants.push(row_json)
                    resolve(variants);
                });
            }).catch(function(error) {
                console.log(error);
                throw error;
            });
    });
}