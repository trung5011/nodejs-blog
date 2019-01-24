var express = require('express');
var router = express.Router();


/************* module ************/
var middewareData= require(__path.__path_middeware+'get-data-in-front-end');


var folderView = __path.__path_views +'page/frontend/page/index';
var layoutview = __path.__path_views +'page/frontend/index';
var homeRouter = require('./home');
var categorysRouter = require('./categorys');
var singleRouter = require('./single');
var contactRouter = require('./contact');

var loginRouter = require('./auth/login');

router.use('/'
			,middewareData.getSubCategorysMenu
			,middewareData.getItemRandom
			,middewareData.getItemSpecial
			,middewareData.getSettings
			,homeRouter);
router.use('/categorys', categorysRouter);
router.use('/article', singleRouter);
router.use('/auth', loginRouter);
router.use('/contact', contactRouter);

// router.use('(/:slug)?', categorysRouter);



module.exports = router;
