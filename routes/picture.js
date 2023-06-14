const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'UvuvwevwevweOnyetenyevweUgwemubwemOssas'
const Joi = require('joi');
const axios = require('axios');

router.get('/', async (req, res) => {
    let link = "https://cdn.donmai.us/";
    let pict = "sample/f9/08/__tingyun_honkai_and_1_more_drawn_by_nanni_jjang__sample-f908fbf975c2b5e7f5d7086a6c6f123d.jpg";
    let getdata = await axios.get(`https://cdn.donmai.us/${pict}`);

    res.status(200).send(getdata)
})

module.exports = router;