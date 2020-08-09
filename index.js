//This file starts the api

//Load env vars
require('dotenv').config();
const config = require('./config')

//Import configured express app
const app = require('./loaders/app');
const port = config.port;


app.listen(port, () => {
    console.log(`App listen on port ${port}`)
});