const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const jwt = require("jsonwebtoken");
const JWT_KEY = 'UvuvwevwevweOnyetenyevweUgwemubwemOssas'
const Joi = require('joi');


// Register user account
router.post('/register', async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(5).required(),
        confirm_pass: Joi.string().min(5).required()
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    let account = {
        ...req.body
    } // cara aksesnya account.username/account.password/account.confirm_pass

    // let { username, password, confirm_pass } = req.body
    //user g boleh regis pake username admin
    if (account.username == 'admin') {
        return res.status(403).send({ message: 'Username has unauthorized credentials' })
    }

    //cek username biar gk duplicate
    let cekDB = await Users.findByPk(account.username)
    if (cekDB) {
        let message = `Username "${account.username}" has been taken`
        return res.status(400).send(message)
    }

    //buat ngcheck password sama cofirm sama apa engga
    if (account.password != account.confirm_pass) {
        return res.status(200).send({
            message: 'Password Confirmation Mismatched'
        })
    }

    //Pake trycatch utk bikin account User
    try {
        let createUser = await Users.create({
            us_username: account.username,
            us_password: account.password,
            us_kuota: 10
        })
    } catch (error) {
        return res.status(500).send(error)
    }
    let message = `Account "${account.username}" has been created! please check our information site before using our services :)`

    return res.status(201).send(message)
})

//User Login
router.post('/login', async (req, res) => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    });

    try {
        await schema.validateAsync(req.body)
    } catch (error) {
        return res.status(403).send(error.toString())
    }

    let account = {
        ...req.body
    }
    // let { username, password } = req.body
    //Login admin
    if (account.username == 'admin' && account.password == 'nimda321') {
        //token yang diambil cuman username dari admin untuk mempermudah akses yg lain
        let token = jwt.sign({
            username: account.username,
        }, JWT_KEY, { expiresIn: '3600s' })
        return res.status(200).send({
            'message': 'Admin successfully logged in',
            username: account.username,
            token: token
        })

    }

    //Cari apa username ada di database 
    let findUser = await Users.findByPk(account.username)
    if (!findUser) {
        return res.status(404).send({ message: 'username not found' })
    }
    //matching password di database
    if (account.password != findUser.us_password) {
        return res.status(400).send({ message: 'incorrect password' })
    }
    // console.log(findUser.us_username)
    // console.log(findUser.us_password)

    //Masukin ke token n bikin JWT expire 1 jam
    let kuota = findUser.us_kuota
    let token = jwt.sign({
        username: account.username,
        password: account.password,
        kuota: kuota
    }, JWT_KEY, { expiresIn: '3600s' })
    return res.status(200).send({
        'message': 'Successfully logged in',
        username: account.username,
        token: token
    })
})

module.exports = router 