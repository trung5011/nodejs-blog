var express = require('express');
var router = express.Router();



var folderView = __path.__path_views +'page/frontend/page/index';
var layoutview = __path.__path_views +'page/frontend/index';
var homeRouter = require('./home');
var categorysRouter = require('./categorys');
var singleRouter = require('./single');


router.use('/', homeRouter);
router.use('/categorys', categorysRouter);
router.use('/article', singleRouter);
// router.use('(/:slug)?', categorysRouter);



module.exports = router;
