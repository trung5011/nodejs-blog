var express      = require('express');
var router       = express.Router();
var MenuModel   = require(__path.__path_models+'menu');
var notify   = require(__path.__path_configs+'notify');
var menuValidator   = require(__path.__path_validates+'menu');
var UtilsHelpers = require(__path.__path_helpers+'utils');
var ParamHelpers = require(__path.__path_helpers+'params');
var systemConfig = require(__path.__path_configs+'systems');
var util = require('util');
var link = `/${systemConfig.prefixAdmin}/menu/list`;
var folderView = __path.__path_views+'page/backend/menu' ;

var pageTitleIndex 	= 'Menu Management - List';
var pageTitleAdd 	= pageTitleIndex + ' - Add';
var pageTitleEdit 	= pageTitleIndex + ' - Edit';




/************* GET users listing. ************/

router.get('/list(/:status)?', async function(req, res, next) {
	let params 				= {};
	params.keyword 			= ParamHelpers.getParam(req.query,'keywords','');;
	params.currentStatus 	= ParamHelpers.getParam(req.params,'status','all');;
	let statusFilter 		= await UtilsHelpers.createFilterStatus(params.currentStatus,'menu');
	params.sortField 		= ParamHelpers.getParam(req.session,'sort_field','oreding');
	params.sortType 		= ParamHelpers.getParam(req.session,'sort_type','asc');
	
	// pagination
	params.pagination = {
		totalItems:0,
		currentPage:parseInt(ParamHelpers.getParam(req.query,'page',1)),
		totalPages:0,
		totalItemsPerPage:10,
		pageRanges:3
	}
	await MenuModel
		.countItem(params).then((data)=>{
			params.pagination.totalItems = data;
			params.pagination.totalPages = Math.ceil(params.pagination.totalItems/params.pagination.totalItemsPerPage);
	});
	MenuModel.listItems(params)
		.then((items)=>{
		res.render(`${folderView}/list`, { 
			title:pageTitleIndex,
			items:items,
			statusFilter:statusFilter,
			currentStatus:params.currentStatus,
			keyword:params.keyword,
			pagination:params.pagination,
			sortField:params.sortField,
			sortType:params.sortType
			
		});
	})
});



/************* changstatus ************/

router.get('/change-status/:id/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	let id 				= ParamHelpers.getParam(req.params,'id','');

	MenuModel
		.changeStatus(currentStatus,id,{task:'update-one'})
		.then((result) => {
		req.flash('success',notify.CHANGE_STATUS_SUCCESS);
		res.redirect(link);
	})
  });

router.post('/change-status/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	
	MenuModel
		.changeStatus(currentStatus,req.body.cid,{task:'update-multi'})
		.then((result) =>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});




/************* delete item ************/

router.get('/delete/:id', function(req, res, next) {
	let id 				= ParamHelpers.getParam(req.params,'id','');
	MenuModel.deleteItem(id,{task:'delete-one'}).then((result) =>{
		req.flash('success', notify.DELETE_SUCCESS);
		res.redirect(link);
	})
});

router.post('/delete', function(req, res, next) {
	let id 				= req.body.cid;
	MenuModel.deleteItem(id,{task:'delete-multi'}).then((result) =>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});




/************* change ordering ************/

router.post('/save-ordering', function(req, res, next) {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	MenuModel.changeOrdering(cids,orderings,null).then((result)=>{
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(link);
	});
});







/************* add and edit item ************/

router.post('/save',async function(req, res, next) {
	await MenuModel.removeAll();
	let item = JSON.parse(Object.assign(req.body.content));
	console.log(item);
	MenuModel.saveItem(item)
	res.end();
});








module.exports = router;
