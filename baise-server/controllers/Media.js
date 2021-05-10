const mediaModel = require('../models/mediaModel');
const Pagination = require('mongoose-sex-page');
const _ = require('underscore');
const Utils = require('../utils/index')
const commonMedia = require('./common/media')

// 上传媒体资源
exports.upload = async (req,res) => {
    let media = await commonMedia.saveMediaAsync(req)
    res.json({ success: true, data: media })
}
// 获取资源列表
exports.get = async (req,res) => {
    const { page, size, location, keywords } = req.query
    if (!location) {return res.json({success: false, message: '缺少目录路由'})}
    const result = await Pagination(mediaModel).find({location: location}).page(page || 1).size(size || 20).exec()
    res.json({ success: true, data: result })
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
// 移动资源
exports.move = (req,res) => {
    const { body } = req
    if (!body.id) {return res.json({success: false, message: '缺少id'})}
    if (!body.location) {return res.json({success: false, message: '缺少目录路由'})}
    // 修改资源的location属性即可
    mediaModel.findById(body.id,(err,target_data) => {
        if (err) {return res.json({success: false,message: err})}
        if (!target_data) {return res.json({success: false,message: '资源不存在'})}
        let newMedia = target_data
        newMedia.location = body.location
        let newData = _.extend(target_data,newMedia)
        newData.save((err,saved_data) => {
            if (err) {
                return res.json({
                    success: false,
                    message: err.message
                })
            }
            res.json({
                success: true,
                data: saved_data
            })
        })
    })
}