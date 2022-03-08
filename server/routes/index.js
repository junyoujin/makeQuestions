const express = require('express');
const router = express.Router();

router.get('/api', (req, res) => {
    console.log('http://localhost:3001/5555555/');
    res.send({title: 'hello react!'});
});

module.exports = router;