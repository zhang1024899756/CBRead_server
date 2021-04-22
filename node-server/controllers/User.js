const userModel = require('../models/userModel');
const _ = require('underscore');
const Utils = require('../utils/index')


// 判断用户是否存在
exports.isrepeat = (req,res) => {
    let _name =  req.body.username
    userModel.findOne({username: _name},(err,target) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database query error! Please inform the administrator for maintenance"
            })
        }
        if (target == null) {
            res.json({success: true,repeat:false})
        }else {
            res.json({success: true,repeat:true})
        }
    })
}
// 用户登陆,颁发token
exports.login = (req,res) => {
    let _name =  req.body.username
    let _password = req.body.password
    userModel.findOne({username: _name},(err,target) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database query error! Please inform the administrator for maintenance"
            })
        }
        if (target == null) {
            res.json({
                success: false,
                data: "用户不存在"
            })
        }else if (_password == target.password) {
            const token = Utils.generatorJwt(target._id) // 颁发token
            res.json({
                success: true,
                data: target,
                token: token
            })
        } else {
            res.json({
                success: false,
                data: "密码错误"
            })
        }
    })
}
// 用户详情
exports.detail = (req,res) => {
    let target = req.query.id
    userModel.findById(target,(err,target_data) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
        res.json({
            success: true,
            data: target_data
        })
    })
}
// 删除用户
exports.delete = (req,res) => {
    let target = req.body.id
    userModel.remove({_id: target}, (err,delete_item) => {
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
                data: {message: '用户不存在'}
            })
        }
    })
}
// 用户列表
exports.list = (req,res) => {
    userModel.findAll((err,data_list) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
        res.json({
            success: true,
            data: data_list,
            res_at: new Date().getTime()
        })
    })
}
// 用户名密码注册
exports.register = (req,res) => {
    let reqData = req.body;
    console.log(req.body)
    if (!reqData.username) {res.json({success: false, data: 'username缺失'})}
    if (!reqData.password) {res.json({success: false, data: 'password缺失'})}
    userModel.findOne({username: reqData.username},(err,target) => {
        if (err) {
            res.json({success: false, data: err})
        }
        if (target === null) {
            let newData = new userModel(reqData)
            newData.save((err,saved_data) => {
                if (err) {
                    console.log(err)
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
        } else {
            res.json({
                success: false,
                data: '用户已存在'
            })
        }
    })
}
// 修改用户信息
exports.editUserInfo = (req,res) => {
    let reqData = req.body;
    const _id =  reqData._id || reqData.id
    if (_id) {
        userModel.findById(_id,(err,target_data) => {
            if (err) {return res.json({success: false,message: err})}
            if (!target_data) {return res.json({success: false,message: '用户不存在'})}
            let newData
            newData = _.extend(target_data,reqData)
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
    } else {
        return res.json({
            success: false,
            message: '未检测到id'
        })
    }
}
