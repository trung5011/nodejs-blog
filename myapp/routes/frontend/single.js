var express = require('express');
var router = express.Router();

var ArticleItemModel   = require(__path.__path_models+'article');
var CategorysModel   = require(__path.__path_models+'categorys');
var ParamHelpers = require(__path.__path_helpers+'params');

var folderView = __path.__path_views +'page/frontend/page/single';
router.get('/:slug', async function(req, res, next) {
	let slugItem	= ParamHelpers.getParam(req.params,'slug','');

	let itemsNews =[];
	let itemsOther=[];
	let itemsArticle;

	await ArticleItemModel.listItemsFrontend(null,{task:'items-news'}).then((items)=>{
		itemsNews = items
	})
	await ArticleItemModel.getItemFrontend(slugItem,null).then((items)=>{
		itemsArticle = items[0];
	});
	await ArticleItemModel.listItemsFrontend(itemsArticle,{task:'items-other'},1).then((items)=>{
		itemsOther = items
	});
	res.render(folderView, { 
		pageTitle:'home',
		top_posts:false,
		itemsNews,
		itemsArticle,
		itemsOther
	});
});





module.exports = router;
