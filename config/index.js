

module.exports = {
    port : process.env.PORT,
    database : {
        host : process.env.DATABASE_HOST,
        dialect : 'postgres',
        username : process.env.DATABASE_USER,
        password : process.env.DATABASE_PASSWORD,
        dbname: process.env.DATABASE_NAME,
        port: process.env.DATABASE_PORT
    }
}