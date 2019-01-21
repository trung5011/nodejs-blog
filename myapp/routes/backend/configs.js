var express      = require('express');
var router       = express.Router();
var ConfigsModel   = require(__path.__path_models+'configs');
var GroupsModel   = require(__path.__path_models+'groups');
var ConfigsValidator   = require(__path.__path_validates+'configs');

var UsersModel   = require(__path.__path_models+'users');
var UsersModelSchema   = require(__path.__path_schema+'users');
var folderView = __path.__path_views+'page/backend/configs' ;
var FileHelper   		= require(__path.__path_helpers+'file');
var UploadThumbnail 	= FileHelper.uploadFile(field='avatar',folderDes = 'article',fileNameLength = 20,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif');
var systemConfig = require(__path.__path_configs+'systems');

var link = `/${systemConfig.prefixAdmin}/`;
var linkConfigs = `/${systemConfig.prefixAdmin}/configs`;
















/************* form item ************/


router.get('/', function(req, res, next) {
	let errors = null;
	UsersModelSchema.count().then((items)=>{
		if(items>0){
			res.redirect(link);

		}else{
			ConfigsModel.listItems().then((item)=>{
				res.render(`${folderView}/form`, { 
					title: 'Configs',
					item:item[0],
					errors : errors
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
		ConfigsValidator.validator(req);
		req.body = JSON.parse(JSON.stringify(req.body));
		let item = Object.assign(req.body);
		let errors = req.validationErrors();

		if(errors){
			res.render(`${folderView}/form`, { 
				title: 'Configs',
				item:item,
				errors:errors
			});
		}
		else{
			await GroupsModel.saveItemConfigs(item).then((result)=>{
				item.group_id = result._id
				item.group_name = result.name
				console.log(result._id);
			});
			await UsersModel.saveItemConfigs(item).then((result)=>{
			});
			await ConfigsModel.saveItemConfigs(item).then((result) =>{
			});
	
			res.redirect(link);
		}
	});
	
	

});









module.exports = router;
