const bcrypt = require('bcrypt');

const getStatusCode = (errCode) => {
    switch(errCode){
        case 'OK':
            return 200;
        case 'CREATED':
            return 201;
        case 'BAD_REQUEST': 
            return 400;
        case 'UNAUTHORIZED':
            return 401;
        case 'NOT_FOUND':
            return 404;
        default:
            return -1;
    }
}

const hashPassword = async (plainPassword) => {
    let hash = await bcrypt.hash(plainPassword, process.env.SALT_ROUNDS);
    return hash;
}

const comparePassword = async (plainPassword, hashedPassword) => {
    let match = await bcrypt.compare(plainPassword, hashPassword);
    return match;
}

module.exports = {
    getStatusCode,
    hashPassword,
    comparePassword
};