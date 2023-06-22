const Sequelize = require("sequelize");
const db = new Sequelize(
    "sql12627995", //dbName
    "sql12627995", //dbUsername
    "2DBiygU7nL", //dbPassword
    {
        host: "sql12.freemysqlhosting.net",
        port: 3306,
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
