const RoleRouter = require('./RoleRouter');
const UserRouter = require('./UserRouter');

module.exports = (app) => {
    app.use('/api', RoleRouter);
    app.use('/api', UserRouter);
}