var express = require('express');
var router = express.Router();


var ArticleItemModel   = require(__path.__path_models+'article');
var CategorysModel   = require(__path.__path_models+'categorys');

var folderView = __path.__path_views +'page/frontend/page/index';
var layoutview = __path.__path_views +'page/frontend/index';

router.get('/', async function(req, res, next) {


	let itemsSpecial =[];
	let itemsNews =[];
	let itemsCategorys =[];
	let itemsRandom =[];
	await ArticleItemModel.listItemsFrontend(null,{task:'items-special'}).then((items)=>{
		itemsSpecial = items
	});
	await ArticleItemModel.listItemsFrontend(null,{task:'items-news'}).then((items)=>{
		itemsNews = items
	});
	await ArticleItemModel.listItemsFrontend(null,{task:'items-random'}).then((items)=>{
		itemsRandom = items
	});
	await CategorysModel.listItemsFrontend(null,{task:'items-in-menu'}).then((items)=>{
		itemsCategorys = items
	});
	res.render(folderView, { 
		pageTitle:'home',
		layout:layoutview,
		top_posts:true,
		itemsSpecial,
		itemsNews,
		itemsCategorys,
		itemsRandom
	});
});





module.exports = router;
