const express = require('express');
const router = express.Router();
const dml = require('../config/dml');
const { pool, config } = require('../config/db');
var sql = require('mssql');



router.post('/search', (req, res) => {
    console.log('SEARCH')
    let query = "SELECT * FROM dbo.QUESTION WHERE 1=1"
    req.body.LCATE_CD !== '' ? query += "AND LCATE_CD = '" + req.body.LCATE_CD + "'" : ''
    req.body.MCATE_CD !== '' ? query += "AND MCATE_CD = '" + req.body.MCATE_CD + "'" : ''
    req.body.PREV_YN !== '' ? query += "AND PREV_YN = '" + req.body.PREV_YN + "'" : ''
    query += "ORDER BY SEQ";
    console.log(typeof (req.body.LCATE_CD))
    console.log(req.body.LCATE_CD)
    console.log(query)
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request().query(query, (err, result) => {
            if (err) {
                return res.json(err)
            } else {
                return res.json(result.recordset)
            }
        })
    })

})


router.post('/comgrp_dtl', (req, res) => {
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request()
            .input('input_param', req.body.COM_CD)
            .query("SELECT * FROM dbo.COMGRP_DTL WHERE COM_GRP_CD = @input_param", (err, result) => {
                if (err) {
                    return res.json(err)
                } else {
                    return res.json(result.recordset)
                }
            })
    })

})



module.exports = router;