const jwt = require('jsonwebtoken')
const Config = require('./config')

exports.generatorJwt = (id) => {
    return jwt.sign({ id },Config.JWT_PRIVATE_KEY,{expiresIn: Config.JWT_EXPIRED})
}