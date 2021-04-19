module.exports = {
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