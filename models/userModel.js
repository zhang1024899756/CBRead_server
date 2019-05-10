const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;


// power 权限 （ 1~9：普通等级； 10：管理员 ）
// signature 签名
// cover 头像
// call  昵称
let UserSchema = new Schema({
    username: String,
    password: String,
    call: {
        type: String,
        default: "江湖新手",
    },
    signature: {
        type: String,
        default: "初入江湖，一脸懵～",
    },
    cover: {
        type: String,
        default: "http://i.huim.com/users/huimgirl.png",
    },
    books: [],
    comments: [],
    power: {
        type: Number,
        default: 1
    },
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})
//save前更新操作时间
UserSchema.pre('save',function (next) {
    //console.log(this)
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})
//封装静态查询
UserSchema.statics = {
    findAll: function(callback) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(callback)
    },
    findById: function(id,callback) {
        return this
            .findOne({_id: id})
            .exec(callback)
    }
}


module.exports = Mongoose.model('user', UserSchema)
