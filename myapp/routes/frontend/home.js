var express = require('express');
var router = express.Router();


var ArticleItemModel   = require(__path.__path_models+'article');
var CategorysModel   = require(__path.__path_models+'categorys');

var folderView = __path.__path_views +'page/frontend/page/index';
var layoutview = __path.__path_views +'page/frontend/index';

router.get('/', async function(req, res, next) {

	let itemsNews =[];
	
	await ArticleItemModel.listItemsFrontend(null,{task:'items-news'}).then((items)=>{
		itemsNews = items
	});
	
	
	res.render(folderView, { 
		pageTitle:'home',
		layout:layoutview,
		top_posts:true,
		itemsNews,
	});
});





module.exports = router;
