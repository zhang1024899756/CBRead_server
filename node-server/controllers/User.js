const userModel = require('../models/userModel');
const _ = require('underscore');



exports.isrepeat = (req,res) => {
    let _name =  req.body.username
    userModel.findOne({username: _name},(err,target) => {
        if (err) {
            console.log(err.message)
            return res.json({
                success: false,
                message: "Database query error! Please inform the administrator for maintenance"
            })
        }
        if (target == null) {
            res.json({repeat:false})
        }else {
            res.json({repeat:true})
        }
    })
}


exports.check = (req,res) => {
    let _name =  req.body.username
    let _password = req.body.password
    userModel.findOne({username: _name},(err,target) => {
        if (err) {
            console.log(err.message)
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
            res.json({
                success: true,
                data: target
            })
        } else {
            res.json({
                success: false,
                data: "密码错误"
            })
        }
    })
}


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



exports.delete = (req,res) => {
    let target = req.body.id
    userModel.remove({_id: target}, (err,delete_item) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
        res.json({
            success: true,
            data: delete_item
        })
    })
}


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
            data: data_list
        })
    })
}


exports.save = (req,res) => {
    let reqData = req.body;
    const _id =  reqData._id || reqData.id
    let newData
    if (_id) {
        userModel.findById(reqData._id,(err,target_data) => {
            if (err) {
                console.log(err)
            }
            newData = _.extend(target_data,reqData)
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
        })
    } else {
        newData = new userModel(reqData)
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
    }
}
