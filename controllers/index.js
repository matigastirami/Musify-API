const config = require('../config');
const sequelize = require('../loaders/sequelize')(config.database);

//Import models
const {RoleModel} = require('../models');
const roleModel = RoleModel(sequelize)

//Import services
const { RoleService } = require('../services');
const roleService = new RoleService(roleModel);

//Import controllers
const RoleController = require('./RoleController');

module.exports = {
    RoleController: new RoleController(roleService)
}