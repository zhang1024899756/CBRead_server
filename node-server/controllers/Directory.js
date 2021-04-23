const directoryModel = require('../models/directoryModel');
const _ = require('underscore');
const commonDirectory = require('./common/directory')

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


