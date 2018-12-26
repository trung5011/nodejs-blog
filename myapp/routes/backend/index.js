var express = require('express');
var router = express.Router();

var itemsRouter = require('./item');
var dashboardRouter = require('./dashboard');
var groupsRouter = require('./groups');
var usersRouter = require('./users');
var categorysRouter = require('./categorys');
var postsRouter = require('./post-items');
var articleRouter = require('./article');


router.get('/', function(req, res, next) {
    res.render(__path.__path_views+'page/backend/auth/login', { title: 'login' });
  });


router.use('/items', itemsRouter);
router.use('/dashboard', dashboardRouter);
router.use('/groups', groupsRouter);
router.use('/users', usersRouter);
router.use('/post-items', postsRouter);
router.use('/categorys', categorysRouter);
router.use('/article', articleRouter);

module.exports = router;
