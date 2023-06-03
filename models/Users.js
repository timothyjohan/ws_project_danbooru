const { getDB } = require("../config/sequelize");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class User extends Model { }
User.init(
    {
        us_username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        us_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        us_kuota: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "User",
        tableName: "users",
    }
),
    module.exports = User