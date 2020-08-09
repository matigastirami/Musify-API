const { UserController } = require('../controllers')
const Router = require('express').Router()

const { body, param } = require('express-validator');

Router.post(
    '/user', 
    [
        body('name')
            .exists({ checkNull: true }).withMessage("name must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("name cannot be only whitespaces")
            .isLength({ max: 50 }).withMessage("name must be a string with length bup to 50 characters"),
        body('surname')
            .exists({ checkNull: true }).withMessage("surname must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("surname cannot be only whitespaces")
            .isLength({ max: 50 }).withMessage("surname must be a string with length up to 50 characters"),
        body('email')
            .exists({ checkNull: true }).withMessage("email must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("email cannot be only whitespaces")
            .isLength({ max: 50 }).withMessage("email must be a string with length up to 50 characters"),
        body('password')
            .exists({ checkNull: true }).withMessage("password must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("password cannot be only whitespaces")
            .isLength({ min: 8, max: 50 }).withMessage("password must be a string with length between 8 and 50 characters")
    ],
    UserController.create
);

Router.put(
    '/user/:id', 
    [
        param('id')
            .exists({ checkNull: true }).withMessage("id must be an not null value")
            .isInt({ allow_leading_zeroes: false, min: 1 }).withMessage("id must be a number greater than 0"),
        body('name')
            .exists({ checkNull: true }).withMessage("name must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("name cannot be only whitespaces")
            .isLength({ max: 50 }).withMessage("name must be a string with length bup to 50 characters"),
        body('surname')
            .exists({ checkNull: true }).withMessage("surname must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("surname cannot be only whitespaces")
            .isLength({ max: 50 }).withMessage("surname must be a string with length up to 50 characters"),
        body('email')
            .exists({ checkNull: true }).withMessage("email must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("email cannot be only whitespaces")
            .isLength({ max: 50 }).withMessage("email must be a string with length up to 50 characters"),
        body('password')
            .exists({ checkNull: true }).withMessage("password must be an not null value")
            .notEmpty({ ignore_whitespace: true }).withMessage("password cannot be only whitespaces")
            .isLength({ min: 8, max: 50 }).withMessage("password must be a string with length between 8 and 50 characters")
    ],
    UserController.update
);

Router.get(
    '/user', 
    UserController.search
);

Router.get(
    '/user/:id',
    [
        param('id')
            .exists({ checkNull: true }).withMessage("id must be an not null value")
            .isNumeric({ no_symbols: true }).withMessage("id must be a number")
    ],
    UserController.get
);

Router.delete(
    '/user/:id', 
    [
        param('id')
            .exists({ checkNull: true }).withMessage("id must be an not null value")
            .isNumeric({ no_symbols: true }).withMessage("id must be a number")
    ],
    UserController.delete
);

module.exports = Router;