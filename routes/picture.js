const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = 'UvuvwevwevweOnyetenyevweUgwemubwemOssas'
const Joi = require('joi');
const axios = require('axios');

router.get('/', async (req, res) => {
    axios.get(`https://danbooru.donmai.us/posts.json`).then(response => {
        console.log(response.data.id[response.count]);
    })
})

router.post('/fav', async (req, res) => {
    
})

router.get('/fav/show', async (req, res) => {
    
})

router.get('/info', async (req, res) => {
    let num = req.query.id;
    axios.get(`https://danbooru.donmai.us/posts/${num}.json`)
    .then(response => {
        console.log(response.data);
        res.status(200).send(
            {
                id : response.data.id,
                tag_name : response.data.tag_string_character,
                created_at : response.data.created_at,
                score : response.data.score,
                fav_count : response.data.fav_count,
                rating : response.data.rating,
                picture : response.data.file_url,
                width : response.data.media_asset.image_width +"px",
                height : response.data.media_asset.image_height +"px",
            });
    })
    .catch(error => {
      console.error(error);
      res.status(404).send({Error : 'Posts not found!'});
    });
})

router.get('/search', async (req, res) => {
    let start = req.query.start_with;
    let search = await axios.get (`https://danbooru.donmai.us/tags.json?search[name_matches]=${start}*`)
    let count  = (search.data).length;
    let data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id : search.data[i].id,
            name : search.data[i].name,
            created_at : search.data[i].created_at,
            updated_at : search.data[i].updated_at,
        })
    }
    res.status(200).send({
        Note : `Here is 20 result about name tag start with ${start}`,
        Data :data
    })
})

module.exports = router;