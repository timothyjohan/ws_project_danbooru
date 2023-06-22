const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_KEY = "UvuvwevwevweOnyetenyevweUgwemubwemOssas";
const Joi = require("joi");
const axios = require("axios");
const Users = require("../models/Users");
const Favorite = require("../models/Favorite");
const { restart } = require("nodemon");

//MASUKIN POST KE FAV
router.post("/fav", async (req, res) => {
    ////////////////////////////////////////////////////////// JOI
    const schema = Joi.object({
        id: Joi.string().required(),
    });

    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        return res.status(403).send(error.toString());
    }
    ////////////////////////////////////////////////////////// AUTH
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        let out = "Authentication token is missing";
        return res.status(401).send({ out });
    }
    let username;
    try {
        let userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username;
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    ////////////////////////////////////////////////////////// SEARCH ID FROM DANBORU
    let num = req.body.id;
    let data;
    let response;
    try {
        response = await axios.get(
            `https://danbooru.donmai.us/posts/${num}.json`
        );
    } catch (error) {
        return res.status(404).send("Post not found");
    }
    // console.log(response.data);
    data = {
        id: response.data.id,
        tag_name: response.data.tag_string_character,
        artist: response.data.tag_string_artist,
        fav_count: response.data.fav_count,
        picture: response.data.file_url,
        tags: response.data.tag_string,
    };
    // return res.status(200).send(data)
    console.log(`data is : ${data}`);

    let tempID = data.id;
    let tempTagname = data.tag_name;
    let tempartist = data.artist;
    let tempPic = data.picture;
    let tempTags = data.tags;

    let query;

    try {
        query = await Favorite.create({
            us_username: username,
            id_picture: tempID,
        });
    } catch (error) {
        return res.status(500).send(error);
    }
    let message = `Post has been added to your favorite successfully`;

    return res.status(201).send({
        message: message,
        ID: tempID,
        tag_name: tempTagname,
        artist: tempartist,
        picture: tempPic,
        tags: tempTags,
    });
});

//SHOW POST YANG SDH MASUK FAV
router.get("/fav/show", async (req, res) => {
    //////////////////////////////////////////////////////////
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        let out = "Authentication token is missing";
        return res.status(401).send({ out });
    }
    let username;
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username;
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let getFav = await Favorite.findAll({
        where: {
            us_username: username,
        },
        attributes: ["id_picture"],
    });
    console.log(getFav);
    return res.status(201).send(getFav);
});

//DELETE POST
router.delete("/delete", async (req, res) => {
    const schema = Joi.object({
        id: Joi.string().required(),
    });

    try {
        await schema.validateAsync(req.body);
    } catch (error) {
        return res.status(403).send(error.toString());
    }

    //////////////////////////////////////////////////////////
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        let out = "Authentication token is missing";
        return res.status(401).send({ out });
    }
    let username;
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username;
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    const num = req.body.id;
    let findFav = await Favorite.findOne({
        where: {
            us_username: username,
            id_picture: num,
        },
    });
    if (findFav) {
        let delUser;
        try {
            delUser = await Favorite.destroy({
                where: {
                    us_username: username,
                    id_picture: num,
                },
            });
        } catch (error) {
            return res.status(500).send(error);
        }
        return res
            .status(201)
            .send({ message: "Post has been deleted from the database" });
    } else {
        return res.status(404).send({ message: `Post not found in favorite` });
    }
});

//Search by ID
router.get("/info", async (req, res) => {
    const schema = Joi.object({
        id: Joi.string().required(),
    });

    try {
        await schema.validateAsync(req.query);
    } catch (error) {
        return res.status(403).send(error.toString());
    }
    const data = { ...req.query };
    //////////////////////////////////////////////////////////
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        let out = "Authentication token is missing";
        return res.status(401).send({ out });
    }
    let username;
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username;
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    //////////////////////////////////////////////////////////

    //Payment kuota
    let findUser = await Users.findByPk(username);
    if (findUser.us_kuota < 3) {
        return res
            .status(403)
            .send(
                "Kuota tidak mencukupi, untuk melakukan fitur ini diperlukan 3 kuota"
            );
    }
    let tempKuota = findUser.us_kuota - 3;
    let update = await Users.update(
        { us_kuota: tempKuota },
        { where: { us_username: username } }
    );

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
                tags: response.data.tag_string,
                kuota_user: tempKuota,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(404).send({ Error: "Posts not found!" });
        });
});

// Search by tags
router.get("/search", async (req, res) => {
    //////////////////////////////////////////////////////////
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        let out = "Authentication token is missing";
        return res.status(401).send({ out });
    }
    let username;
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username;
        // const insert =
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    //////////////////////////////////////////////////////////

    //Payment kuota
    let findUser = await Users.findByPk(username);
    if (findUser.us_kuota < 5) {
        return res
            .status(403)
            .send(
                "Kuota tidak mencukupi, untuk melakukan fitur ini diperlukan 5 kuota"
            );
    }
    let tempKuota = findUser.us_kuota - 5;
    let update = await Users.update(
        { us_kuota: tempKuota },
        { where: { us_username: username } }
    );

    let start = req.query.start_with;
    let nsfw = "";
    if (req.query.nsfw) {
        // return res.status(200).send('yes')
        nsfw = "is%3Asfw";
        if (req.query.nsfw == "true") {
            console.log(req.query.nsfw);
            nsfw = "is%3ansfw";
        }
    }
    let search = await axios.get(
        `https://danbooru.donmai.us/posts.json?tags=${start}+${nsfw}`
    );
    // console.log(search)
    let temp = search.data;

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
        kuota_user: tempKuota,
        Note: `Here is ${count} result about name tag start with ${start}`,
        Data: data,
    });
});

// Get all post from latest
router.get("/search_notag", async (req, res) => {
    //////////////////////////////////////////////////////////
    let token = req.header("x-auth-token");
    if (!req.header("x-auth-token")) {
        let out = "Authentication token is missing";
        return res.status(401).send({ out });
    }
    let username;
    let userdata;
    try {
        userdata = jwt.verify(token, JWT_KEY);
        console.log(userdata.username);
        username = userdata.username;
        // const insert =
    } catch (err) {
        return res.status(400).send("Invalid JWT Key");
    }

    //////////////////////////////////////////////////////////

    //Payment kuota
    let findUser = await Users.findByPk(username);
    if (findUser.us_kuota < 10) {
        return res
            .status(403)
            .send(
                "Kuota tidak mencukupi, untuk melakukan fitur ini diperlukan 10 kuota"
            );
    }
    let tempKuota = findUser.us_kuota - 10;
    let update = await Users.update(
        { us_kuota: tempKuota },
        { where: { us_username: username } }
    );

    let start = req.query.start_with;
    let search = await axios.get(`https://danbooru.donmai.us/posts.json`);
    console.log(search);
    let temp = search;
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
        kuota_user: tempKuota,
        Note: `Here is ${count} result of the latest posts`,
        Data: data,
    });
});

router.get("/random-image", async (req, res) => {
    try {
        const min = 100000;
        const max = 999999;
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        const response = await axios.get(
            `https://danbooru.donmai.us/posts/${randomNum}.json`
        );
        console.log(randomNum);
        const {
            id,
            file_url,
            tag_string,
            description,
            image_width,
            image_height,
            artist,
        } = response.data;

        const tags = tag_string.split(" ");
        const imageData = {
            id,
            url: file_url,
            artist: artist ? artist : "Unknown",
            tags,
            description: description ? description : "",
            width: image_width,
            height: image_height,
        };
        res.json(imageData);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/popular-images", async (req, res) => {
    axios
        .get(`https://danbooru.donmai.us/explore/posts/popular.json`)
        .then((response) => {
            console.log(response.data);
            let data = [];
            for (let i = 0; i < 5; i++) {
                data.push({
                    id: response.data[i].id,
                    tag_name: response.data[i].tag_string_character,
                    artist: response.data[i].tag_string_artist,
                    created_at: response.data[i].created_at,
                    score: response.data[i].score,
                    fav_count: response.data[i].fav_count,
                    rating: response.data[i].rating,
                    picture: response.data[i].file_url,
                    width: response.data[i].media_asset.image_width + "px",
                    height: response.data[i].media_asset.image_height + "px",
                    tags: response.data[i].tag_string,
                    // kuota_user: tempKuota,
                });
            }
            return res.status(200).send({
                data: data,
            });
        })
        .catch((error) => {
            console.error(error);
            res.status(404).send({ Error: "Posts not found!" });
        });
});

router.get("/trending-tags", async (req, res) => {
    const daysAgo = 7; // Mengatur jumlah hari mundur untuk mencari tag populer

    try {
        const response = await axios.get(
            `https://danbooru.donmai.us/tags.json?search[order]=count&search[date]=${daysAgo}d`
        );
        const tags = response.data.map((tag) => tag.name);

        res.json({ tags });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/max-post", async (req, res) => {
    try {
        const response = await axios.get(
            `https://danbooru.donmai.us/counts/posts.json`
        );
        res.json({ msg: `Total Post : ${response.data.counts.posts}` });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/last-created-user", async (req, res) => {
    try {
        const postsResponse = await axios.get(
            `https://danbooru.donmai.us/posts.json?limit=0`
        );
        const totalPosts = postsResponse.headers["x-total-count"];

        const likesResponse = await axios.get(
            `https://danbooru.donmai.us/posts.json?search[order]=fave_count.desc&limit=1`
        );
        const totalLikes = likesResponse.data[0].fave_count;

        const artistsResponse = await axios.get(
            `https://danbooru.donmai.us/artist_versions.json`
        );
        const famousArtists = artistsResponse.data.map((artist) => ({
            name: artist.name,
            artist_id: artist.id,
            created_at: artist.created_at,
            contact_person: artist.urls,
        }));

        console.log(famousArtists);
        res.json(famousArtists);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;
