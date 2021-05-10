const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const LinkId = Schema.Types.ObjectId;
const savePre = require('./common/savePre')
const shemaStatic = require('./common/schemaStatic')

const generatorSchema = new Schema({
    // 资源访问链接
    src: {
        type: String,
        require: true
    },
    // 资源名
    name: {
        type: String,
        default: 'new media',
        require: true
    },
    // 创建者
    creator: {type: LinkId, ref: 'user'},
    // minetype类型
    mimetype: String,
    encoding: String,
    // 虚拟路径，表示媒体资源显示的路径，可用于制作虚拟文件系统
    location: {
        type: String,
        default: '/',
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

module.exports = Mongoose.model('media', generatorSchema)
