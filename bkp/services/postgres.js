const config = require('config');
const { Pool } = require('pg');

const pool = new Pool({
  host: config.get("PG_HOST"),
  user: config.get("PG_USER"),
  max: config.get("PG_MAX_POOL_CONNECTIONS"),
  password: config.get("PG_PASSWORD"),
  database: config.get("PG_DATABASE"),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: /*process.env.NODE_ENV == 'development' ? false : true*/ false
})

module.exports = pool;