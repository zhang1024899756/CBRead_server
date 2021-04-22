module.exports = {
    server_name: 'clumsy_bird_read_server',
    server_port: 8080, // 服务端口
    mongoPort: 27017,  // 数据库端口
    staticPath: 'media_data', // 静态资源目录（绝对路径）
    virtualPath: 'media', // 虚拟路径（前端调用静态资源使用）
    JWT_PRIVATE_KEY: 'zxyemailqqcom',  // token私钥
    JWT_EXPIRED: 60 * 60 * 60 * 24 * 30 // token有效期
}