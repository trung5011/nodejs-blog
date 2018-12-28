var express = require('express');
var router = express.Router();

/************* router ************/

var itemsRouter = require('./item');
var homeRouter = require('./home');
var dashboardRouter = require('./dashboard');
var groupsRouter = require('./groups');
var usersRouter = require('./users');
var categorysRouter = require('./categorys');
var postsRouter = require('./post-items');
var articleRouter = require('./article');

/************* module ************/
var middewarePermission = require(__path.__path_middeware+'permission');





router.use('/',middewarePermission,homeRouter);
router.use('/dashboard',dashboardRouter);
router.use('/items', itemsRouter);
router.use('/groups', groupsRouter);
router.use('/users', usersRouter);
router.use('/post-items', postsRouter);
router.use('/categorys', categorysRouter);
router.use('/article', articleRouter);

module.exports = router;
