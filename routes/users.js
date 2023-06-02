const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const jwt = require("jsonwebtoken");
const JWT_KEY = 'UvuvwevwevweOnyetenyevweUgwemubwemOssas'



// Register user account
router.post('/register', async (req, res) => {
    let { username, password, confirm_pass } = req.body


    //cek username biar gk duplicate
    let cekDB = await Users.findByPk(username)
    if (cekDB) {
        let message = `Username "${username}" has been taken`
        return res.status(400).send(message)

    }
    //Password mismatch
    if (password != confirm_pass) {
        return res.status(200).send({
            message: 'Password Confirmation Mismatched'
        })

    }

    //Pake trycatch utk bikin account User
    let createUser
    try {
        createUser = await Users.create({
            us_username: username,
            us_password: password,
            us_kuota: 10
        })
    } catch (error) {
        return res.status(500).send(error)

    }
    let message = `Account "${username}" has been created! please check our information site before using our services :)`

    return res.status(200).send(message)
})

//User Login
router.post('/login', async (req, res) => {
    let { username, password } = req.body
    //Cari apa username ada di database 
    let findUser = await Users.findByPk(username)
    if (!findUser) {
        return res.status(404).send({ message: 'username not found' })
    }
    //matching password di database
    if (password != findUser.us_password) {
        return res.status(400).send({ message: 'incorrect password' })
    }
    // console.log(findUser.us_username)
    // console.log(findUser.us_password)

    //Masukin ke token n bikin JWT expire 1 jam
    let kuota = findUser.us_kuota
    let token = jwt.sign({
        username: username,
        password: password,
        kuota: kuota
    }, JWT_KEY, { expiresIn: '3600s' })
    return res.status(200).send({
        'message': 'Successfully logged in',
        username: username,
        token: token
    })
})

module.exports = router 