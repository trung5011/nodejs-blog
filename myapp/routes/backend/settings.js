var express      = require('express');
var router       = express.Router();
var SettingsModel   = require(__path.__path_models+'settings');
var notify   = require(__path.__path_configs+'notify');
var settingsValidator   = require(__path.__path_validates+'settings');
var systemConfig = require(__path.__path_configs+'systems');
var util = require('util');
var FileHelper   		= require(__path.__path_helpers+'file');
var link = `/${systemConfig.prefixAdmin}/settings`;
var folderView = __path.__path_views+'page/backend/settings' ;


var UploadThumbnail 	= FileHelper.uploadFile(field='logo',folderDes = 'article',fileNameLength = 20,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif');















/************* form item ************/


router.get('/', function(req, res, next) {
	SettingsModel.listItems().then((item)=>{
		res.render(`${folderView}/form`, { 
			title: 'Settings' ,
			item:item[0]
		});
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

		item.logo = (req.file !== undefined) ? req.file.filename : item.image_old;
		SettingsModel.saveItem(item).then((result) =>{
			// req.flash('success', message);
			res.redirect(req.get('referer'));
		})
	
	});
	
	
	// if (errors) {
	// 	let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
	
	// }else{
	// 	let message = (taskCurrent == "add") ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
	// 	SettingsModel.saveItem(item,{task:taskCurrent}).then((result) =>{
	// 		req.flash('success', message);
	// 		res.redirect(link);
	// 	})
	// }

});









module.exports = router;
