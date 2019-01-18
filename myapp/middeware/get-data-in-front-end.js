var ArticleItemModel   = require(__path.__path_models+'article');
var CategorysModel   = require(__path.__path_models+'categorys');
var SettingsModel   = require(__path.__path_models+'settings');
var MenuModel   = require(__path.__path_models+'menu');
var data = {
	getSubCategorysMenu : async (req,res,next)=>{
		await MenuModel.listItemsFrontend(null,{task:'items-in-menu'}).then((items)=>{
			res.locals.itemsCategorys = items
		});
		next();
	},
	getItemInCategorys :  async (req,res,next)=>{
		await ArticleItemModel.listItemsFrontend(null,{task:'items-news'}).then((items)=>{
			res.locals.itemsNews = items
		});
		next();
	},
	getItemSpecial:async (req,res,next)=>{
		await ArticleItemModel.listItemsFrontend(null,{task:'items-special'},3).then((items)=>{
			res.locals.itemsSpecial = items
		});
		next();
	},
	getItemRandom:async (req,res,next)=>{
		await ArticleItemModel.listItemsFrontend(null,{task:'items-random'},1).then((items)=>{
			res.locals.itemsRandom = items
		});
		next();
	},
	getSettings:async (req,res,next)=>{
		await SettingsModel.listItems().then((items)=>{
			res.locals.settings = items[0]
		});
		next();
	}
}




module.exports = data;