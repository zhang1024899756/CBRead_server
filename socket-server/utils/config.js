module.exports = {
    server_name: 'clumsy_bird_read_server',
    server_port: 8090, // 服务端口
    mongoPort: 27017,  // 数据库端口
    JWT_PRIVATE_KEY: 'zxyemailqqcom',  // token私钥
    JWT_EXPIRED: 60 * 60 * 60 * 24 * 30, // token有效期
}