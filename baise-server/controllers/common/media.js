const mediaModel = require('../../models/mediaModel');
const Config = require('../../utils/config');
const fs = require('fs')

// 删除目录后继续删除目录作用域内链接的所有资源
exports.removeMediaWithRemoveDirectory = (req) => {
    const { body } = req
    return new Promise((resolve,reject) => {
        mediaModel.find({location: { $regex: body.location, $options: 'i' }},async (err, dir_target)=> {
            if (dir_target) {
                // 先将真实文件删除，成功后再删除虚拟的资源对象
                const mediaIds = await Promise.all(dir_target.map(async item => {
                    item = await fsUnlink(item)
                    return item ? item : null
                }))
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
// 删除资源文件
const fsUnlink = (item) => {
    return new Promise((resolve,reject)=> {
        fs.unlink(item.src.replace(Config.virtualPath, Config.staticPath),(err) => {
            if (!err) {
                resolve(item._id)
            } else {
                console.log(`${item.src} fsUnlink err:`, err)
                resolve(false)
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