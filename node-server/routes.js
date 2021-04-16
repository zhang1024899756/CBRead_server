const Express = require('express');
const router = Express.Router();


const Comment = require('./controllers/Comment');
const User = require('./controllers/User');




router.post('/save/comment',Comment.save);
router.get('/list/comment',Comment.list);
router.post('/delete/comment',Comment.delete);
router.get('/detail/comment',Comment.detail);


router.post('/repeat/user',User.isrepeat);
router.post('/check/user',User.check);
router.post('/save/user',User.save);
router.get('/list/user',User.list);
router.post('/delete/user',User.delete);
router.get('/detail/user',User.detail);






module.exports = router;