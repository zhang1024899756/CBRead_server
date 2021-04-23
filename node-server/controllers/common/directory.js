const directoryModel = require('../../models/directoryModel');
const _ = require('underscore');
// 创建目录
exports.createDirectory = (req) => {
    const { body, user } = req
    let _directoryModel
    return new Promise((resolve,reject) => {
        // location必传检测
        if (!body.location) {
            // 注意：目录路由除了“/”根路由，其他路由全部为自动分配
            resolve({success: false, message: '缺少目录路由'})
        }
        // 使用封装工具函数处理Structure
        changeStructure(body, user, 'create',(result) => {
            resolve(result)
        })
    })
}
// 修改目录名称
exports.renameDirectory = (req) => {
    const { body, user } = req
    return new Promise((resolve,reject) => {
        // location必传检测
        if (!body.location || !body.name || body.name === '') {
            // 注意：目录路由除了“/”根路由，其他路由全部为自动分配
            resolve({success: false, message: !body.location ? '缺少目录路由' : '目录名为空'})
        }
        // 使用封装工具函数处理Structure
        changeStructure(body, user, 'rename',(result) => {
            resolve(result)
        })
    })
}
// 封装Structure变更工具
const changeStructure = (body, user, action, callback) => {
    let _directoryModel
    directoryModel.findOne({creator: user.id || user._id},(err, dir_target)=> {
        if (dir_target) {
            let newDir = dir_target
            // 结构数据字符串化保存在数据库，编辑时先转化为json
            let _structure = JSON.parse(newDir.structure)
            // 调用自定义工具函数对数据进行编辑
            _structure = pollingStruct(_structure, body, action)
            newDir.structure = JSON.stringify(_structure)
            _directoryModel = _.extend(dir_target,newDir)
        } else {
            if (action === 'create') {
                // 没有创建目录系统则新建一个
                let _structure = [{
                    name: body.name || '新目录',
                    location: '/0/',
                    child: []
                }]
                _directoryModel = new directoryModel({
                    creator: user.id || user._id,
                    structure: JSON.stringify(_structure)
                })
            } else if (action === 'rename') {
                callback({success: false, message: JSON.stringify(err)})
                return
            }
        }
        // 数据库保存
        _directoryModel.save((err,result) => {
            if (result) {
                callback({success: true, data: result})
            } else {
                callback({success: false, message: JSON.stringify(err)})
            }
        })
    })
}
// 轮询结构,新建目录
const pollingStruct = (_structure, body, action) => {
    let newlocation = ''
    if(body.location === '/') {
        // 根路由时
        if (_structure.length>0) {
            let deepArr = _structure[_structure.length-1].location.split('/')
            newlocation = setDeepArr(deepArr)
        } else {
            newlocation = '/0/'
        }
        // 追加目录数据
        _structure.push({
            name: body.name || '新目录',
            location: newlocation,
            child: []
        })
        return _structure
    }
    // 非根路由
    // 返回修改完的数据
    return _structure.map((struct, ) => {
        // 匹配到目录路由时
        if (struct.location === body.location) {
            // 不同动作使用不同编辑函数
            if (action === 'create') {
                struct = createDirWithStruct(struct, body, newlocation)
            } else if(action === 'rename') {
                struct = renameDirWithStruct(struct, body)
            }
        } else if(struct.location !== body.location && struct.child.length > 0) {
            // 递归查询孩子
            pollingStruct(struct.child, body, action)
        }
        // 不要忘了map return
        return struct
    })
}
// 重命名目录的struct函数
const renameDirWithStruct = (struct, body) => {
    struct.name = body.name || struct.name || '未命名目录'
    return struct
}
// 创建目录的struct函数
const createDirWithStruct = (struct, body, newlocation) => {
    if (struct.child.length>0) {
        // 分配路由
        // 目录的路由由数字来标识，每添加一个目录，数字同级递增
        // 将字符串转化为数组，处理完后再转化还原原来的格式
        let deepArr = struct.child[struct.child.length-1].location.split('/')
        newlocation = setDeepArr(deepArr)
    } else {
        // 空目录路由直接处理
        newlocation = struct.location + '0/'
    }
    // 追加目录数据
    struct.child.push({
        name: body.name || '新目录',
        location: newlocation,
        child: []
    })
    return struct
}
const setDeepArr = (deepArr) => {
    deepArr.shift()
    deepArr.pop()
    deepArr[deepArr.length - 1] = parseInt(deepArr[deepArr.length - 1]) + 1
    return '/' + deepArr.join('/') + '/'
}