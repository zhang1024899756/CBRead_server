const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const LinkId = Schema.Types.ObjectId;
const savePre = require('./common/savePre')
const shemaStatic = require('./common/schemaStatic')

const generatorSchema = new Schema({
    creator: {
        type: LinkId,
        ref: 'user',
        require: true
    },
    // 目录结构，保存为一个多维数组字符串化后的结果
    // 使用这种结构的目的是考虑到每个用户都有自己的目录结构，如果扁平化，表中的记录将非常的多，会增加查询的负担
    // 使用这种方式有利于前端显示，也有利于存储，语义化好
    structure: {
        type: String,
        default: '[]',
        require: true
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

module.exports = Mongoose.model('directory', generatorSchema)