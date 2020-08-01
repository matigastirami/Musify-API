const { RoleController } = require('../controllers')
const Router = require('express').Router()

const { body } = require('express-validator');

Router.post(
    '/role', 
    [
        body('description')
            .exists({ checkNull: true }).withMessage("description must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("description cannot be only whitespaces")
            .isLength({ min: 6, max: 20 }).withMessage("description must be an string with length between 6 and 20 characters"),
    ],
    RoleController.create
);

Router.put('/role/:id', RoleController.update);
Router.get('/role', RoleController.search);
Router.get('/role/:id', RoleController.get);
Router.delete('/role/:id', RoleController.delete);

module.exports = Router;