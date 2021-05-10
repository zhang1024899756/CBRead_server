const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const LinkId = Schema.Types.ObjectId;
const savePre = require('./common/savePre')
const shemaStatic = require('./common/schemaStatic')

const generatorSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
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
        default: "",
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
generatorSchema.pre('save',savePre)
//封装静态查询
generatorSchema.statics = shemaStatic


module.exports = Mongoose.model('user', generatorSchema)
