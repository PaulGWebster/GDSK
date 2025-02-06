const crypto = require('crypto');

const generateCookie = () => {
    return crypto.randomBytes(16).toString('hex');
};

module.exports = generateCookie;