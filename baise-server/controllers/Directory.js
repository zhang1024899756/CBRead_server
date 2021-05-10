const directoryModel = require('../models/directoryModel');
const _ = require('underscore');
const commonDirectory = require('./common/directory')
const commonMedia = require('./common/media')

// 新建目录
exports.new = async (req,res) => {
    // 调用自定义封装工具来处理新建
    const result = await commonDirectory.createDirectory(req)
    return res.json(result)
}
// 重命名目录
exports.rename = async (req,res) => {
    // 调用自定义封装工具来处理重命名
    const result = await commonDirectory.renameDirectory(req)
    return res.json(result)
}
// 删除目录
// 删除目录会将子目录和目录下文件一起删除
// 目录和资源文件是链接结构而非寄生结构，所以注意分别删除
exports.remove = async (req,res) => {
    // 调用自定义封装工具来处理删除目录
    const resultD = await commonDirectory.removeDirectory(req)
    if (!resultD.success) {
        return res.json(resultD)
    }
    // 查询出匹配location的资源，删除（并删除挂载的文件）
    const resultM = await commonMedia.removeMediaWithRemoveDirectory(req)
    return res.json({directory: resultD, media: resultM})
}
// 获取用户目录结构
exports.get = (req,res) => {
    const { user } = req
    directoryModel.findOne({creator: user.id || user._id},(err, dir_target)=> {
        if (dir_target) {
            return res.json({
                success: true,
                data: JSON.parse(dir_target.structure)
            })
        } else {
            return res.json({
                success: false,
                data: JSON.stringify(err)
            })
        }
    })
}
// 重置用户的文件目录系统
// 注意重置文件系统意味着删除所有虚拟目录，资源和目录之间的链接将被打断
exports.clear = (req,res) => {
    const { user } = req
    directoryModel.findOne({creator: user.id || user._id},(err, dir_target)=> {
        reset = dir_target
        reset.structure = '[]'  // 重置
        let _directoryModel = _.extend(dir_target,reset)
        _directoryModel.save((err, result)=> {
            if (result) {
                res.json({
                    success: true,
                    data: result
                })
            } else {
                res.json({
                    success: false,
                    message: JSON.stringify(err)
                })
            }
        })
    })
}


