var express = require('express');
var router = express.Router();

var ArticleItemModel   = require(__path.__path_models+'article');
var CategorysModel   = require(__path.__path_models+'categorys');
var ParamHelpers = require(__path.__path_helpers+'params');


var folderView = __path.__path_views +'page/frontend/page/categorys';
router.get('(/:slug)?', async function(req, res, next) {
	let slugCategory 	= ParamHelpers.getParam(req.params,'slug','');
	let idSlug 			= '';
	let itemsInCategorys=[];
	if(slugCategory !=''){
		await CategorysModel.findSlug(slugCategory ).then((items)=>{
			idSlug= items[0].id;
		})
	}
	if(slugCategory ==''){
		await ArticleItemModel.listItemsFrontend({id:''},{task:'items-in-categorys'}).then((items)=>{
			itemsInCategorys = items
		})
	}else{
		await ArticleItemModel.listItemsFrontend({id:idSlug},{task:'items-in-categorys'}).then((items)=>{
			itemsInCategorys = items
		})
	}


	res.render(folderView, { 
		pageTitle:'categorys',
		top_posts:false,
		itemsInCategorys,
	});
});





module.exports = router;
