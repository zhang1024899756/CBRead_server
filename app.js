let Express = require('express');
let bodyParser = require('body-parser');
const Mongoose = require('mongoose');

let port = process.env.port || 8000;
let dbUrl = 'mongodb://localhost:27017/clumsy_bird_read_server';
let app = Express();

//连接数据库
Mongoose.connect(dbUrl,err => {
    if (!err) {
        console.log('数据库成功连接到：' + dbUrl);
    }
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended: false}));

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
