const Sequelize = require("sequelize");
require('dotenv').config();
const db = new Sequelize(
    process.env.DB_NAME, //dbName
    process.env.DB_USERNAME, //dbUsername
    process.env.DB_PASSWORD, //dbPassword
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: console.log,
        timezone: "+07:00",
    }
);

module.exports = {
    initDB: () => {
        return db.authenticate();
    },
    getDB: () => {
        console.log('hehehhehehe')
        return db;
    },
};
