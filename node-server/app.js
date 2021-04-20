let Express = require('express');
const Mongoose = require('mongoose');

let port = process.env.port || 8080;
let mongoUrl = 27017;
let dbUrl = `mongodb://mongo:${mongoUrl}/clumsy_bird_read_server`; // see docker-compose.yml nodeapp links mongo
let app = Express();

//连接数据库
Mongoose.connect(dbUrl,{useNewUrlParser: true});
Mongoose.connection.once('open', ()=>console.log(`数据库于${mongoUrl}端口连接成功...`));

app.use(Express.json({limit: '50mb'}));
app.use(Express.urlencoded({limit:'50mb',extended: false}));

//跨域
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(require('./routes.js'));

app.listen(port,() => {
    console.log('====================================');
    console.log("服务在..." + port + "...端口运行.....");
    console.log('====================================');
});
