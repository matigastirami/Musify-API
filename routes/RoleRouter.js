const { RoleController } = require('../controllers')
const Router = require('express').Router()

const { body, param } = require('express-validator');

Router.post(
    '/role', 
    [
        body('description')
            .exists({ checkNull: true }).withMessage("description must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("description cannot be only whitespaces")
            .isLength({ min: 6, max: 20 }).withMessage("description must be a string with length between 6 and 20 characters"),
    ],
    RoleController.create
);

Router.put(
    '/role/:id', 
    [
        body('description')
            .exists({ checkNull: true }).withMessage("description must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("description cannot be only whitespaces")
            .isLength({ min: 6, max: 20 }).withMessage("description must be a string with length between 6 and 20 characters"),
        param('id')
            .exists({ checkNull: true }).withMessage("id must be an not null value")
            .isInt({ allow_leading_zeroes: false, min: 1 }).withMessage("id must be a number greater than 0")
    ],
    RoleController.update
);

Router.get(
    '/role', 
    RoleController.search
);

Router.get(
    '/role/:id',
    [
        param('id')
            .exists({ checkNull: true }).withMessage("id must be an not null value")
            .isNumeric({ no_symbols: true }).withMessage("id must be a number")
    ],
    RoleController.get
);

Router.delete(
    '/role/:id', 
    [
        param('id')
            .exists({ checkNull: true }).withMessage("id must be an not null value")
            .isNumeric({ no_symbols: true }).withMessage("id must be a number")
    ],
    RoleController.delete
);

module.exports = Router;