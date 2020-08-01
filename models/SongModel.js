const { DataTypes } = require('sequelize');

module.exports = (orm) => {
    exports.SongModel = orm.define('song', {
        id: { type: DataTypes.INTEGER, primaryKey: true },
        number: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        duration: {
            type: DataTypes.TIME,
            allowNull: false
        },
        file: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        album_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                
            }
        }
    })
}
