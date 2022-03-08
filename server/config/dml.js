const { config, pool } = require('./db');
const sql = require('mssql');

async function getLcate() {
    try {
        let pool = await pool;
        let lcate_mst = await pool.request()
            //.input('input_parameter', sql.Int , 1111)
            .query("SELECT * FROM dbo.LCATE_MST");
        //.query("SELECT * FROM dbo.LCATE_MST WHERE COM_CD = @input_parameter");
        console.log(pool)
        console.log(lcate_mst)
        console.log(lcate_mst.recordsets)
        return lcate_mst.recordsets;
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getLcate: getLcate
}