var express      = require('express');
var router       = express.Router();
var ConfigsModel   = require(__path.__path_models+'configs');
var UsersModel   = require(__path.__path_models+'users');
var UsersModelSchema   = require(__path.__path_schema+'users');
var folderView = __path.__path_views+'page/backend/configs' ;
var FileHelper   		= require(__path.__path_helpers+'file');
var UploadThumbnail 	= FileHelper.uploadFile(field='avatar',folderDes = 'article',fileNameLength = 20,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif');
var systemConfig = require(__path.__path_configs+'systems');

var link = `/${systemConfig.prefixAdmin}/`;
















/************* form item ************/


router.get('/', function(req, res, next) {
	UsersModelSchema.count().then((items)=>{
		if(items>0){
			res.redirect(link);
		}else{
			ConfigsModel.listItems().then((item)=>{
				res.render(`${folderView}/form`, { 
					title: 'Configs',
					item:item[0]
				});
			});
		}
	});
	
  });




/************* add and edit item ************/

router.post('/save', function(req, res, next) {

	UploadThumbnail(req,res, async (err) => {
		if(err){
			console.log(err);
		}
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		await UsersModel.saveItemConfigs(item).then((result)=>{
		});

		await ConfigsModel.saveItemConfigs(item).then((result) =>{
			// req.flash('success', message);
		});
		res.redirect(link);

	});
	
	

});









module.exports = router;
