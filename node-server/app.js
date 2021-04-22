let Express = require('express');
const Mongoose = require('mongoose');
const Config = require('./utils/config')

let port = process.env.port || Config.server_port;
let dbUrl = `mongodb://mongo:${Config.mongoPort}/${Config.server_name}`; // see docker-compose.yml nodeapp links mongo
let app = Express();

//连接数据库
Mongoose.connect(dbUrl,{useNewUrlParser: true});
Mongoose.connection.once('open', ()=>console.log(`数据库于${Config.mongoPort}端口连接成功...`));
// 解析
app.use(Express.json({limit: '50mb'}));
app.use(Express.urlencoded({limit:'50mb',extended: false}));

//跨域
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// 静态资源
app.use(`${Config.virtualPath}`, Express.static(`${Config.staticPath}`))
// app.use('/assets', Express.static('/media_data'))

// 路由
app.use(require('./routes.js'));

app.listen(port,() => {
    console.log('====================================');
    console.log("服务在..." + port + "...端口运行.....");
    console.log('====================================');
});
