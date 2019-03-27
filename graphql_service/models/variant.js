var mysql = require('mysql')
var con = mysql.createConnection({
  host: "mysql",
  user: "root",
  password: "rootpass",
  database: "var_db",
  port: "3306",
  connectTimeout: 100000,
});

con.connect();

// searches first 5 variants and returns it
exports.find = () => {
    return new Promise(resolve => {
        var variants;
        con.query('select variant_id, chrom, start, end, ref, alt from variants limit 5', function (error, results, fields) {
            if (error) {
                console.log(error);
                throw error;
            }
            variants = JSON.parse(JSON.stringify(results));
            resolve(variants);
        });
    });
}