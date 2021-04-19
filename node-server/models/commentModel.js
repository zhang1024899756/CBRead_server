const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;
const LinkId = Schema.Types.ObjectId;
const savePre = require('./common/savePre')
const shemaStatic = require('./common/schemaStatic')

const generatorSchema = new Schema({
    content: {
        type: String,
        require: true
    },
    from: {
        type: LinkId,
        ref: 'user',
        require: true
    },
    to: {
        type: LinkId,
        ref: 'user'
    },
    parentId: {
        type: String,
        default: null
    },
    replay: [{
        type: LinkId,
        ref: 'comment'
    }],
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
generatorSchema.pre('save', savePre)
//封装静态查询
generatorSchema.statics = shemaStatic


module.exports = Mongoose.model('comment', generatorSchema)