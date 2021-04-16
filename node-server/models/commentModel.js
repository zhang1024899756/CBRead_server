const Mongoose = require('mongoose');

const Schema = Mongoose.Schema;


let CommentSchema = new Schema({
    title: String,
    images: [],
    content: String,
    type: {
        type: String,
        default: "normal",
    },
    book: {},
    author: {},
    star: {
        type: Number,
        default: 0,
    },
    comments: [],
    commentNumber: {
        type: Number,
        default: 0,
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
CommentSchema.pre('save',function (next) {
    console.log(this)
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }
    next()
})
//封装静态查询
CommentSchema.statics = {
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


module.exports = Mongoose.model('comment', CommentSchema)
