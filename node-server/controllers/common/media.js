const mediaModel = require('../../models/mediaModel');
const Config = require('../../utils/config');

// 删除目录后继续删除目录作用域内链接的所有资源
exports.removeMediaWithRemoveDirectory = (req) => {
    const { body } = req
    return new Promise((resolve,reject) => {
        mediaModel.find({location: { $regex: body.location, $options: 'i' }},(err, dir_target)=> {
            if (dir_target) {
                const mediaIds = dir_target.map(item => item._id)
                mediaModel.remove({_id: {$in: mediaIds}}, (err,delete_item) => {
                    if (err) {
                        resolve({success: false,message: JSON.stringify(err)})
                    } else {
                        resolve({success: true,data: delete_item})
                    }
                })
            } else {
                resolve({success: false,message: JSON.stringify(err)})
            }
        })
    })
}

// 获取资源列表
exports.getList = (req) => {
    const { body } = req
    return new Promise((resolve,reject) => {
        mediaModel.find({location: body.location},(err, dir_target)=> {
            if (dir_target) {
                resolve({success: true,data: dir_target})
            } else {
                resolve({success: false,message: JSON.stringify(err)})
            }
        })
    })
}

// 保存媒体资源
exports.saveMediaAsync = (req) => {
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