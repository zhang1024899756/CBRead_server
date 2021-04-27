const Express = require('express');
const multer = require('multer');
const router = Express.Router();

const Auth = require('./utils/auth')
const upload = multer({storage : require('./utils/multer') });

// const Comment = require('./controllers/Comment');
const Media = require('./controllers/Media');
const Directory = require('./controllers/Directory');
const User = require('./controllers/User');

/**虚拟目录模块**/ 
/**此模块与媒体资源模块强关联**/ 
router.get('/get/directory', Auth, Directory.get);
router.post('/new/directory', Auth, Directory.new);
router.post('/rename/directory', Auth, Directory.rename);
router.post('/remove/directory', Auth, Directory.remove);
router.post('/clear/directory', Auth, Directory.clear);



/**资源媒体模块**/
/**此模块与虚拟目录模块强关联**/ 
router.post('/get/media', Auth, Media.get);
router.post('/upload/media', Auth, upload.array('file', 5), Media.upload);
router.post('/delete/media', Auth, Media.delete);
router.post('/move/media', Auth, Media.move);


/**用户模块**/ 
router.post('/repeat/user',User.isrepeat);
router.post('/login/user',User.login);
router.post('/register/user',User.register);
router.post('/edit/user', Auth, User.editUserInfo);
router.get('/list/user', Auth, User.list);
router.post('/delete/user', Auth, User.delete);
router.get('/detail/user', Auth, User.detail);

// router.post('/save/comment',Comment.save);
// router.get('/list/comment',Comment.list);
// router.post('/delete/comment',Comment.delete);
// router.get('/detail/comment',Comment.detail);




module.exports = router;