const mediaModel = require('../models/mediaModel');
const _ = require('underscore');
const Utils = require('../utils/index')


exports.upload = (req,res) => {
    let paths = [];
    req.files.map(file => {
        let path = file.path.replace(/\\/g, "/");
        paths.push(path)
    })
    res.json({
        success: true,
        data: paths
    })
}

exports.delete = (req,res) => {

}

exports.move = (req,res) => {

}