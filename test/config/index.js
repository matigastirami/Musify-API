
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('musify_test', 'test', 'test', {
    dialect: 'sqlite',
    storage: ':memory:', // or ':memory:'
    dialectOptions: {
      // Your sqlite3 options here
    }
});

module.exports = sequelize;