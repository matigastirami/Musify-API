const config = require('../config');
const sequelize = require('../loaders/sequelize')(config.database);

//Import models
const { RoleModel, UserModel } = require('../models');
const roleModel = RoleModel(sequelize);
const userModel = UserModel(sequelize);

//Import services
const { RoleService, UserService } = require('../services');
const roleService = new RoleService(roleModel);
const userService = new UserService(userModel, roleModel);

//Import controllers
const RoleController = require('./RoleController');
const UserController = require('./UserController');

module.exports = {
    RoleController: new RoleController(roleService),
    UserController: new UserController(userService)
};