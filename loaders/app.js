//This file configures the api
const express = require('express');
const app = express();
const path = require('path');

let swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  // List of files to be processed.
  apis: [path.resolve(__dirname, '..', 'routes', 'RoleRouter.js')],
  // You can also set globs for your apis
  swaggerDefinition: {
    info: {
      description: 'Test API with autogenerated swagger doc',
      swagger: '2.0',
      title: 'Dessert API',
      version: '1.0.0',
    },
  },
};
const specs = swaggerJsdoc(options);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs.default));
const configureRouter = require('../routes');
configureRouter(app);


module.exports = app;