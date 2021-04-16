const CommentModel = require('../models/commentModel');
const _ = require('underscore');


exports.detail = (req,res) => {
    let target = req.query.id
    CommentModel.findById(target,(err,target_comment) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
        res.json({
            success: true,
            data: target_comment
        })
    })
}



exports.delete = (req,res) => {
    console.log(req.body)
    let target = req.body.id
    CommentModel.remove({_id: target}, (err,delete_item) => {
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
    console.log(req)
    CommentModel.findAll((err,comment_list) => {
        if (err) {
            return res.json({
                success: false,
                message: err.message
            })
        }
        res.json({
            success: true,
            data: comment_list
        })
    })
}


exports.save = (req,res) => {
    let reqComment = req.body
    let newComment
    if (reqComment._id) {
        CommentModel.findById(reqComment._id,(err,target_comment) => {
            if (err) {
                console.log(err)
            }
            newComment = _.extend(target_comment,reqComment)
            newComment.save((err,saved_comment) => {
                if (err) {
                    console.log(err)
                    return res.json({
                        success: false,
                        message: err.message
                    })
                }
                res.json({
                    success: true,
                    data: saved_comment
                })
            })
        })
    } else {
        newComment = new CommentModel(reqComment)
        newComment.save((err,saved_comment) => {
            if (err) {
                console.log(err)
                return res.json({
                    success: false,
                    message: err.message
                })
            }
            res.json({
                success: true,
                data: saved_comment
            })
        })
    }
}
