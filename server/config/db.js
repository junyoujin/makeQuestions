var sql = require('mssql');

const config = {
    user: 'sa',
    password: 'qwer!234',
    server: "localhost",
    // server: 'DESKTOP-0AM2B78\SQLEXPRESS',
    database: 'MQN',
    // stream: true,
    options: {
        encrypt: false,
        enableArithAbort: true
    },
}

const pool = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log("Connected MSSQL");
        return pool;
    })
    .catch(err => console.log("DB Connection Failed : " + err));


module.exports = { pool, config };