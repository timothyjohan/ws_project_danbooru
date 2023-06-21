const { getDB } = require("../config/sequelize");
const sequelize = getDB();
const { Model, DataTypes } = require("sequelize");

class Favorite extends Model { }
Favorite.init(
    {
        id_fav: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        us_username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_picture: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        timestamps: false,
        modelName: "Favorite",
        tableName: "favorite",
    }
),
    module.exports = Favorite