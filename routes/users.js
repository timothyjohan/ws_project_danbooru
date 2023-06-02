const express = require('express');
const router = express.Router();
const Users = require('../models/Users');

router.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

module.exports = router 