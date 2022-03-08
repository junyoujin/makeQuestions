const express = require('express');
const router = express.Router();
const { pool } = require("../config/db");
const sql = require('mssql');

router.get('/', (req, res) => {
    // sql.excuteSql('', req, res);
})



function excuteSql(query, req, res) {
    let request = new sql.Request();
    request.stream = true;

    sql = 'select * from dbo.LCATE_MST';
    request.query(sql, (err, recodeset) => {
        if (err) {
            return console.log('query error : ' + err);
        }
    });

    let result = [];
    request.on('error', function (err) {
        console.log(err);
    })
        .on('row', (row) => {
            result.push(row)
        })
        .on('done', () => {
            console.log('result : ' + result);
            res.send({ name: result });
        });
    res.send({ title: 'halo!' });
}


module.exports = router;