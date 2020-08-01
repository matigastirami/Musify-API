var config = {};

// Heroku
config.PUERTO = process.env.PORT || 3000;

// MLab
config.DB_CONNECTION = process.env.MONGO_CONNECTION || 'mongodb://dev:dev@ds133657.mlab.com:33657/dbmusify_dev';

// Amazon s3
config.S3_BUCKET = process.env.S3_BUCKET || 'maty-test-bucket';
config.S3_ACCESSKEYID = process.env.S3_ACCESSKEYID || 'AKIAIGQ6VUQJ5O32AV2A';
config.S3_SECRETACCESSKEY = process.env.S3_SECRETACCESSKEY || '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';

//Google cloud MySQL
config.MYSQL_HOST = process.env.MYSQL_HOST || '35.226.39.226';
config.MYSQL_USER = process.env.MYSQL_USER || 'developer';
config.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD || 'developer';
config.MYSQL_DATABASE = process.env.MYSQL_DATABASE || 'musify_dev';

module.exports = config;