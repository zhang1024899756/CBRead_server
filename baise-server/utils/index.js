const jwt = require('jsonwebtoken')
const { JSEncrypt } = require('node-jsencrypt')
const Config = require('./config')
const fs = require('fs')


// 工具函数--生产token
exports.generatorJwt = (id) => {
    return jwt.sign({ id },Config.JWT_PRIVATE_KEY,{expiresIn: Config.JWT_EXPIRED})
}

// 工具函数--对密码进行解密
/** 
 * 需要对密码传输进行安全加固时，前端密码使用公钥加密
 * const encrypt = new JSEncrypt()
 * encrypt.setPublicKey(pubKey)
 * let password = encrypt.encrypt(password)
 *  **/
// 后端使用私钥解密
exports.decodeJsencrypt = (password) => {
    const jsEncrypt = new JSEncrypt()
    const privateKey = fs.readFileSync('./private.key','utf-8')
    jsEncrypt.setPublicKey(privateKey)
    return jsEncrypt.decrypt(password)
}