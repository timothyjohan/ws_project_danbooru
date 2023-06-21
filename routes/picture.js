const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = "UvuvwevwevweOnyetenyevweUgwemubwemOssas";
const Joi = require("joi");
const axios = require("axios");
const Users = require('../models/Users');
const Favorite = require('../models/Favorite');

const { restart } = require("nodemon");

// router.get("/", async (req, res) => {
//     await axios.get(`https://danbooru.donmai.us/posts.json`).then((response) => {
//         console.log(response.data.length);
//     });
// });

router.post("/fav", async (req, res) => {
    //////////////////////////////////////////////////////////
    let token = req.header('x-auth-token')
    if (!req.header('x-auth-token')) {
        let out = 'Authentication token is missing';
        return res.status(401).send({ out });
    }
    let username
    try {
        let userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username
        // const insert = 
    } catch (err) {
        return res.status(400).send('Invalid JWT Key');
    }

    //////////////////////////////////////////////////////////

    let num = req.body.id;
    let data
    let response
    try {
        response = await axios.get(`https://danbooru.donmai.us/posts/${num}.json`)

    } catch (error) {
        return res.status(404).send('Post not found');

    }
    // console.log(response.data);
    data = {
        id: response.data.id,
        tag_name: response.data.tag_string_character,
        artist: response.data.tag_string_artist,
        fav_count: response.data.fav_count,
        picture: response.data.file_url,
        tags: response.data.tag_string
    }
    // return res.status(200).send(data)
    console.log(`data is : ${data}`)


    let tempID = data.id
    let tempTagname = data.tag_name
    let tempartist = data.artist
    let tempPic = data.picture
    let tempTags = data.tags

    let query

    try {
        query = await Favorite.create({
            us_username: username,
            id_picture: tempID
        })
    } catch (error) {
        return res.status(500).send(error);
    }
    let message = `Post has been added to your favorite successfully`

    return res.status(201).send({
        message: message,
        ID: tempID,
        tag_name: tempTagname,
        artist: tempartist,
        picture: tempPic,
        tags: tempTags
    })


});

router.get("/fav/show", async (req, res) => { });

//Search by ID
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

// Search by tags
router.get("/search", async (req, res) => {
    let start = req.query.start_with;
    let nsfw = ''
    if (req.query.nsfw) {
        // return res.status(200).send('yes')
        nsfw = 'is%3Asfw'
        if (req.query.nsfw == 'true') {
            console.log(req.query.nsfw)
            nsfw = 'is%3ansfw'
        }
    }
    let search = await axios.get(
        `https://danbooru.donmai.us/posts.json?tags=${start}+${nsfw}`
    );
    // console.log(search)
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

// Get all post from latest
router.get("/search_notag", async (req, res) => {
    let start = req.query.start_with;
    let search = await axios.get(
        `https://danbooru.donmai.us/posts.json`
    );
    console.log(search)
    let temp = search
    // return res.status(200).send(temp)

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
        Note: `Here is ${count} result of the latest posts`,
        Data: data,
    });
});


module.exports = router;
