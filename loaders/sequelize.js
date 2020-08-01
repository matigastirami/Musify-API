const { Sequelize } = require('sequelize');

module.exports = (config)  => {
  const connection = new Sequelize(`${config.dialect}://${config.username}:${config.password}@${config.host}:${config.port}/${config.dbname}`);
  return connection;
};