const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
// session在整个会话周期都会存在，不是存储在本地的，服务器通过session的设置，可以甄别当前会话是那个用户在使用
const session = require('express-session');
const Config = require('./utils/config');
let port = process.env.port || Config.server_port;
app.use(session({
    secret: 'session'+new Date().getTime(), // session的id
    resave: false, // 是否允许session重新设置
    saveUninitialized: true // 是否允许session在储存容器中可以进行修改
}))
// app.get('/connection',(req,res,next)=> {
//     console.log(req)
//     res.json({success: true})
// })
server.listen(port);
const io = require('socket.io')(server);
// 给io绑定事件
io.on('connection', (socket) => {
    console.log(socket)
    socket.on('send', (msg) => {
        console.log(msg)
        // 敏感词库校验 后端的事儿
        io.emit('message', msg);
    })
})