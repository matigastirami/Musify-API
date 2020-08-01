const { DataTypes } = require('sequelize');

module.exports = (orm) => {
    exports.ArtistModel = orm.define('artist', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        image: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING(100), //Add reference
            allowNull: false
        }
    })
}
