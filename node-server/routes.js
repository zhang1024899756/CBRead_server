const Express = require('express');
const multer = require('multer');
const router = Express.Router();

const Auth = require('./utils/auth')
const upload = multer({storage : require('./utils/multer') });

const Comment = require('./controllers/Comment');
const Media = require('./controllers/Media');
const User = require('./controllers/User');




router.post('/save/comment',Comment.save);
router.get('/list/comment',Comment.list);
router.post('/delete/comment',Comment.delete);
router.get('/detail/comment',Comment.detail);

/**资源媒体模块**/
router.post('/upload/media', Auth, upload.array('file', 5), Media.upload);
router.post('/delete/media',Media.delete);
router.post('/move/media',Media.move);


/**用户模块**/ 
router.post('/repeat/user',User.isrepeat);
router.post('/login/user',User.login);
router.post('/register/user',User.register);
router.post('/edit/user', Auth, User.editUserInfo);
router.get('/list/user', Auth, User.list);
router.post('/delete/user', Auth, User.delete);
router.get('/detail/user', Auth, User.detail);






module.exports = router;