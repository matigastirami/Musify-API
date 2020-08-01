const { DataTypes } = require('sequelize');
const ArtistModel = require('./ArtistModel');

module.exports = (orm) => orm.define('album', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(50),
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        date_release: {
            type: DataTypes.DATE,
            allowNull: false
        },
        artist_id: {
            type: DataTypes.INTEGER, //Add reference
            allowNull: false,
            references: {
                model: ArtistModel,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        image: {
            type: DataTypes.STRING(100), //Add reference
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING(100), //Add reference
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
)
