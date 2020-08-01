//This file starts the api
const express = require('express');
const app = express();

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

const configureRouter = require('../routes');
configureRouter(app);

module.exports = app;