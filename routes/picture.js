const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = "UvuvwevwevweOnyetenyevweUgwemubwemOssas";
const Joi = require("joi");
const axios = require("axios");

// router.get("/", async (req, res) => {
//     await axios.get(`https://danbooru.donmai.us/posts.json`).then((response) => {
//         console.log(response.data.length);
//     });
// });

router.post("/fav", async (req, res) => {
    let token = req.header('x-auth-token')
    if(!req.header('x-auth-token')){
       let out = 'Authentication token is missing';
       return res.status(401).send({out});
    }
    try{
        let userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        // const insert = 
    }catch(err){
        return res.status(400).send('Invalid JWT Key');
    }

});

router.get("/fav/show", async (req, res) => { });

router.get("/info", async (req, res) => {
    let num = req.query.id;
    axios
        .get(`https://danbooru.donmai.us/posts/${num}.json`)
        .then((response) => {
            console.log(response.data);
            return res.status(200).send({
                id: response.data.id,
                tag_name: response.data.tag_string_character,
                artist: response.data.tag_string_artist,
                created_at: response.data.created_at,
                score: response.data.score,
                fav_count: response.data.fav_count,
                rating: response.data.rating,
                picture: response.data.file_url,
                width: response.data.media_asset.image_width + "px",
                height: response.data.media_asset.image_height + "px",
                tags: response.data.tag_string
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(404).send({ Error: "Posts not found!" });
        });
});

router.get("/search", async (req, res) => {
    let start = req.query.start_with;
    let search = await axios.get(
        `https://danbooru.donmai.us/posts.json?tags=${start}`
    );
    console.log(search)
    let temp = search.data

    let count = search.data.length;
    let data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: search.data[i].id,
            artist_name: search.data[i].tag_string_artist,
            created_at: search.data[i].created_at,
            tags: search.data[i].tag_string,
        });
    }
    res.status(200).send({
        Note: `Here is ${count} result about name tag start with ${start}`,
        Data: data,
    });
});

module.exports = router;
