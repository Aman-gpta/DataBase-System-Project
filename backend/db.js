const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "omega232",
    host: "localhost",
    port: 5432,
    database: "dbs"
});
module.exports = pool;