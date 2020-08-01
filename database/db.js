const sequelize = require('../loaders/sequelize')
const config = require('../config')

module.exports = () => {
    return sequelize(config.database);
}