const mediaModel = require('../models/mediaModel');
const _ = require('underscore');
const Utils = require('../utils/index')
const Config = require('../utils/config')

// 上传媒体资源
exports.upload = async (req,res) => {
    let media = await saveMediaAsync(req)
    res.json({
        success: true,
        data: media
    })
}
// 保存媒体资源
const saveMediaAsync = (req) => {
    return new Promise((resolve,reject)=> {
        let mediaArr = [];
        req.files.map( (file, index) => {
            let path = file.path.replace(/\\/g, "/").replace(`${Config.staticPath}`, `${Config.virtualPath}`);
            let _mediaModel = new mediaModel({
                src: path,
                name: file.originalname.split('.')[0] || 'new media',
                creator: req.user,
                mimetype: file.mimetype,
                encoding: file.encoding,
                location: req.body.location || '/'
            })
            _mediaModel.save((err, saved_data)=> {
                if (saved_data) {
                    mediaArr.push(saved_data)
                    if (index === req.files.length - 1) {
                        return resolve(mediaArr)   
                    }
                }
            })
        })
    })
}

exports.delete = (req,res) => {

}

exports.move = (req,res) => {

}