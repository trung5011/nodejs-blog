var express = require('express');
var router 	= express.Router();
var fs		= require('fs');

/************* router ************/

var itemsRouter = require('./item');
var homeRouter = require('./home');
var dashboardRouter = require('./dashboard');
var groupsRouter = require('./groups');
var usersRouter = require('./users');
var categorysRouter = require('./categorys');
var postsRouter = require('./post-items');
var articleRouter = require('./article');
var menuRouter = require('./menu');
var settingsRouter = require('./settings');
var ParamHelpers = require(__path.__path_helpers+'params');

/************* module ************/
var middewarePermission = require(__path.__path_middeware+'permission');
var FileHelper   		= require(__path.__path_helpers+'file');
var UploadThumbnail 	= FileHelper.uploadFile(field='flFileUpload',folderDes = 'article',fileNameLength = 20,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif');




router.use('/editor-img', function(req, res, next) {
	const images = fs.readdirSync(__path.__path_uploads+'article')
    var sorted = [];
    for (let img of images) {
        if (img.split('.').pop() === "png" ||
            img.split('.').pop() === "jpg" ||
            img.split('.').pop() === "jpeg" ||
            img.split('.').pop() === "svg"
        ) {
            var abc = {
                "image": img,
                "folder": "/"
            }
            sorted.push(abc)
        }
    }
    res.send(sorted);
});

router.use('/',middewarePermission,homeRouter);
router.use('/dashboard',dashboardRouter);
router.use('/items', itemsRouter);
router.use('/groups', groupsRouter);
router.use('/users', usersRouter);
router.use('/post-items', postsRouter);
router.use('/categorys', categorysRouter);
router.use('/article', articleRouter);
router.use('/menu', menuRouter);
router.use('/settings', settingsRouter);

router.use('/uploads', async function(req, res, next) {
	UploadThumbnail (req,res, async (err) => {
		if(err){
			console.log(err)
		}
		res.redirect(req.get('referer'));
	});
});
router.use('/delete/:name', async function(req, res, next) {
	let name 		= ParamHelpers.getParam(req.params,'name','');
	var folderUpload = 'public/uploads/article/';
	FileHelper.removeFile(folderUpload,name);
	res.redirect(req.get('referer'));
});

module.exports = router;
