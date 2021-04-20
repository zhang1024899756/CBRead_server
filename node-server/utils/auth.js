const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const Config = require('./config')


passport.use(new BearerStrategy(
    function(token, done) {
        //这里查询token是否有效
        let verifyToken = jwt.verify(token, Config.JWT_PRIVATE_KEY)
        userModel.findById(verifyToken.id,(err,target) => {
            if (target) {
                //有效的话在done方法的第二个参数传递用户对象，然后路由的req.user对象即为当前对象
                done(null,target);
            } else {
                done(null,false)
            }
        })
    }
));

module.exports = passport.authenticate('bearer', { session: false })