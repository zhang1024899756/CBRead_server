const multer = require('multer');
const moment = require("moment");
const path = require('path');
const fs = require('fs')
const Config = require('./config');
module.exports = multer.diskStorage({
    destination: async function(req, file, cb) {
        console.log('file', file)
        let fileType = distributionType(file)
        
        let _path = path.join(`${Config.staticPath}/${fileType}`)
        try {
            fs.statSync(_path);
        } catch (error) {
            await createMkdir(_path)
        }
        cb(null, _path);
    },
    filename: function(req, file, cb) {
        cb(null, moment().format("YYYYMMDDhhmmss") + file.originalname);
    }
})

const distributionType = (file) => {
    if (file.mimetype.indexOf('image') !== -1) return 'image'
    if (file.mimetype.indexOf('video') !== -1) return 'video'
    if (file.mimetype.indexOf('audio') !== -1) return 'audio'
    if (file.mimetype.indexOf('text') !== -1) return 'text'
    // 其他未匹配类型全部使用other
    return 'other'
}

const createMkdir = (path) => {
    return new Promise((resolve,reject) => {
        // recursive允许多级创建
        fs.mkdir(path, { recursive: true }, (err)=> {
            if (!err) {
                resolve()
            } else {
                reject()
            }
        })
    })
}