const Express = require('express');
const router = Express.Router();

const Auth = require('./utils/auth')

const Comment = require('./controllers/Comment');
const User = require('./controllers/User');




router.post('/save/comment',Comment.save);
router.get('/list/comment',Comment.list);
router.post('/delete/comment',Comment.delete);
router.get('/detail/comment',Comment.detail);


router.post('/repeat/user',User.isrepeat);
router.post('/login/user',User.login);
router.post('/register/user',User.register);
router.post('/edit/user', Auth, User.editUserInfo);
router.get('/list/user', Auth, User.list);
router.post('/delete/user', Auth, User.delete);
router.get('/detail/user', Auth, User.detail);






module.exports = router;