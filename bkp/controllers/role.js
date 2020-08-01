'use strict'

var Role = require('../models/role')

exports.getRoles = (req, res) => {
    Role.find(null, (result) => {
        res.status(result.code).send(result.description)
    })
}