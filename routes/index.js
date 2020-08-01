const RoleRouter = require('./RoleRouter');

module.exports = (app) => {
    app.use('/api', RoleRouter);
}