const mediaModel = require('../models/mediaModel');
const _ = require('underscore');
const Utils = require('../utils/index')
const commonMedia = require('./common/media')

// 上传媒体资源
exports.upload = async (req,res) => {
    let media = await commonMedia.saveMediaAsync(req)
    res.json({
        success: true,
        data: media
    })
}
// 获取资源列表
exports.get = async (req,res) => {
    const { body } = req
    if (!body.location) {return res.json({success: false, message: '缺少目录路由'})}
    let result = await commonMedia.getList(req)
    res.json(result)
}

// 删除资源by id
// 多个ID使用逗号分隔
exports.delete = (req,res) => {
    const { body } = req
    if (!body.id) {return res.json({success: false, message: '缺少id'})}
    body.id = body.id.split(',')
    mediaModel.remove({_id: {$in: body.id}}, (err,delete_item) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
        if (delete_item.deletedCount > 0) {
            return res.json({
                success: true,
                data: {message: '删除成功', ...delete_item}
            })
        } else {
            res.json({
                success: false,
                data: {message: '资源不存在'}
            })
        }
    })
}

exports.move = (req,res) => {

}