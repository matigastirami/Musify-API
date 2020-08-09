const { DataTypes, Deferrable } = require('sequelize');
const RoleModel = require('./RoleModel');

module.exports = (orm) => orm.define('users', {
        id: { 
            type: DataTypes.INTEGER, 
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        surname: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(50),
            allowNull: false
        },
        role_id: {
            type: DataTypes.INTEGER, //Add reference
            allowNull: false,
            references: {
                model: RoleModel,
                key: 'id',
                deferrable: Deferrable.INITIALLY_IMMEDIATE
            }
        },
        image_path: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        password: {
            type: DataTypes.STRING(300),
            allowNull: false
        },
        created: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated: {
            type: DataTypes.DATE,
            allowNull: true
        },
        deleted: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
)
