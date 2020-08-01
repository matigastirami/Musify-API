const { DataTypes } = require('sequelize');

module.exports = (orm) => orm.define('role', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    createddate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    modifydate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    enddate: {
        type: DataTypes.DATE, //Add reference
        allowNull: true
    }
},{
    freezeTableName: true,
    timestamps: false
})

