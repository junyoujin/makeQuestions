const express = require('express');
const router = express.Router();
const dml = require('../config/dml');
const { pool, config } = require('../config/db');
var sql = require('mssql');

/*
router.get('/lcate_mst', (req, res) => {
    dml.getLcate().then((data) => {
        console.log(data)
        // res.json(data[0]);
    })
    // res.send({ lcate: getLcate(req) });
});


router.get('/lcate', (req, res) => {
    let connection = new sql.ConnectionPool(config, function (err) {
        let request = new sql.Request(connection);
        request.query("SELECT * FROM dbo.LCATE_MST", function (err, rowData) {
            if (err) console.log(err)
            console.log(rowData)
            res.send(rowData)
        });
    });
})
*/


router.get('/hi', async (req, res) => {
    try {
        const pool = await pool;
        const result = await pool.request()
            .query("SELECT * FROM dbo.LCATE_MST");
        res.send(result);
    } catch (err) {
        res.status(500);
        res.send(err.message);
    }
})


router.get('/his', (req, res) => {
    res.send({ result: '123' })
})

router.post('/data', (req, res) => {
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request().query("SELECT * FROM dbo.LCATE_MST", (err, result) => {
            if (err) {
                return res.json(err)
            } else {
                return res.json(result.recordset)
            }
        })
    })

})


router.post('/comgrp_mst', (req, res) => {
    let query = "SELECT * FROM dbo.COMGRP_MST WHERE  ( COM_CD LIKE '%" + req.body.COMMON + "%' OR COM_NM LIKE N'%" + req.body.COMMON + "%' )";
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


router.post('/lcate_mst', (req, res) => {
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request().query("SELECT * FROM dbo.LCATE_MST", (err, result) => {
            if (err) {
                return res.json(err)
            } else {
                return res.json(result.recordset)
            }
        })
    })

})


router.post('/mcate_mst', (req, res) => {
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request()
            .input('input_param', req.body.CATE_CD)
            .query("SELECT * FROM dbo.MCATE_MST WHERE LCATE_CD = @input_param", (err, result) => {
                if (err) {
                    return res.json(err)
                } else {
                    return res.json(result.recordset)
                }
            })
    })

})

router.post('/part_mst', (req, res) => {
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request().query("SELECT * FROM dbo.PART_MST", (err, result) => {
            if (err) {
                return res.json(err)
            } else {
                return res.json(result.recordset)
            }
        })
    })

})


router.post('/chapther_mst', (req, res) => {
    sql.connect(config, err => {
        if (err) console.log(err)
        new sql.Request()
            .input('input_param', req.body.PART_CD)
            .query("SELECT * FROM dbo.PART_CPR_MST WHERE PART_CD = @input_param", (err, result) => {
                if (err) {
                    return res.json(err)
                } else {
                    return res.json(result.recordset)
                }
            })
    })

})


module.exports = router;