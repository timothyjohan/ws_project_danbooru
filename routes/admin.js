const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const jwt = require("jsonwebtoken");
const JWT_KEY = 'UvuvwevwevweOnyetenyevweUgwemubwemOssas'

router.get('/users', async (req, res) => {
    ///////////////////////////////////////// Authorization Admin //////////////////////////////////////////////////////
    let token = req.header('x-auth-token')
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Authentication token is missing')
    }
    let userdata
    try {
        userdata = jwt.verify(token, JWT_KEY)
    } catch (err) {
        return res.status(400).send('Invalid JWT Key')

    }
    let user = userdata.username
    if (user != 'admin') {
        return res.status(403).send('Unauthorized Access')
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let getUsers = await Users.findAll({
        attributes: ['us_username', 'us_kuota']
    })
    return res.status(200).send(getUsers)
})

router.delete('/users', async (req, res) => {
    ///////////////////////////////////////// Authorization Admin //////////////////////////////////////////////////////
    let token = req.header('x-auth-token')
    if (!req.header('x-auth-token')) {
        return res.status(400).send('Authentication token is missing')
    }
    let userdata
    try {
        userdata = jwt.verify(token, JWT_KEY)


    } catch (err) {
        return res.status(400).send('Invalid JWT Key')

    }
    let user = userdata.username
    if (user != 'admin') {
        return res.status(403).send('Unauthorized Access')
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    let { username } = req.body

    let findUser = await Users.findByPk(username)
    if (!findUser) {
        return res.status(404).send('User not found')

    }
    let delUser
    try {
        delUser = await Users.destroy({
            where: { us_username: username }
        })

    } catch (error) {
        return res.status(500).send(error)

    }
    return res.status(201).send({ message: 'User has been deleted from the database' })

})

module.exports = router 
