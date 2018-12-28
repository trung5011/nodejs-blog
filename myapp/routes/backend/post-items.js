var express      = require('express');
var router       = express.Router();
var PostItemModel   = require(__path.__path_models+'post-items');
var CategorysModel   = require(__path.__path_models+'categorys');
var notify   = require(__path.__path_configs+'notify');
var postItemsValidator   = require(__path.__path_validates+'post-items');
var UtilsHelpers = require(__path.__path_helpers+'utils');
var ParamHelpers = require(__path.__path_helpers+'params');
var systemConfig = require(__path.__path_configs+'systems');
var util = require('util');
var link = `/${systemConfig.prefixAdmin}/post-items/list`;
var folderView = __path.__path_views+'page/backend/post-items' ;
var pageTitleIndex 	= 'post-items Management - List';
var pageTitleAdd 	= pageTitleIndex + ' - Add';
var pageTitleEdit 	= pageTitleIndex + ' - Edit';




/************* GET post-items listing. ************/

router.get('/list(/:status)?', async function(req, res, next) {
	let params = {};
	params.keyword 		= ParamHelpers.getParam(req.query,'keywords','');;
	params.currentStatus 	= ParamHelpers.getParam(req.params,'status','all');;
	let statusFilter 	= await UtilsHelpers.createFilterStatus(params.currentStatus,'post-items');
	params.sortField 		= ParamHelpers.getParam(req.session,'sort_field','oreding');
	params.sortType 		= ParamHelpers.getParam(req.session,'sort_type','asc');
	params.categorys_id 		= ParamHelpers.getParam(req.session,'categorys_id','');
	
	// pagination
	params.pagination = {
		totalItems:0,
		currentPage:parseInt(ParamHelpers.getParam(req.query,'page',1)),
		totalPages:0,
		totalItemsPerPage:4,
		pageRanges:3
	}

	let categorysItems = [];
	await CategorysModel.listItemsInSelectbox()
			.then((items)=>{
				categorysItems = items;
			});

	
	await PostItemModel
		.countItem(params).then((data)=>{
		params.pagination.totalItems = data;
		params.pagination.totalPages = Math.ceil(params.pagination.totalItems/params.pagination.totalItemsPerPage);
	});

	PostItemModel.listItems(params,null)
		.then((items)=>{
		res.render(`${folderView}/list`, { 
			title:pageTitleIndex,
			items:items,
			statusFilter:statusFilter,
			currentStatus:params.currentStatus,
			keyword:params.keyword,
			pagination:params.pagination,
			sortField:params.sortField,
			sortType:params.sortType,
			categorysItems:categorysItems,
			categorys_id:params.categorys_id
		});
	})
});



/************* changstatus ************/


router.get('/change-status/:id/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	let id 				= ParamHelpers.getParam(req.params,'id','');

	PostItemModel
		.changeStatus(currentStatus,id,{task:'update-one'})
		.then((result) => {
		req.flash('success',notify.CHANGE_STATUS_SUCCES);
		res.redirect(link);
	})
  });

router.post('/change-status/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	
	PostItemModel
		.changeStatus(currentStatus,req.body.cid,{task:'update-multi'})
		.then((result) =>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});




/************* delete item ************/

router.get('/delete/:id', function(req, res, next) {
	let id 				= ParamHelpers.getParam(req.params,'id','');
	PostItemModel.deleteItem(id,{task:'delete-one'}).then((result) =>{
		req.flash('success', notify.DELETE_SUCCESS);
		res.redirect(link);
	})
});

router.post('/delete', function(req, res, next) {
	let id 				= req.body.cid;
	PostItemModel.deleteItem(id,{task:'delete-multi'}).then((result) =>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});



/************* change ordering ************/

router.post('/save-ordering', function(req, res, next) {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	PostItemModel.changeOrdering(cids,orderings,null).then((result)=>{
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(link);
	});
});




/************* form item ************/


router.get('/form(/:id)?', async function(req, res, next) {
	let id 		= ParamHelpers.getParam(req.params,'id','');;
	let item    = {
		name:'',
		status:'',
		ordering:'',
		group:{
			id:'',
			name:''
		},
	}
	let errors = null;
	let categorysItems = [];
	await CategorysModel.listItemsInSelectbox().then((items)=>{
		categorysItems = items;
	});
			

	if (id === ''){
		res.render(`${folderView}/form`, { 
			title: pageTitleAdd ,
			item:item,
			errors:errors,
			categorysItems:categorysItems
		});
	}else{
		PostItemModel.getItem(id).then((result) =>{
			res.render(`${folderView}/form`, { 
				title: pageTitleEdit ,
				item:result,
				errors:errors,
				categorysItems:categorysItems
			});
		});
	}
  });




/************* add and edit item ************/

router.post('/save', async function(req, res, next) {
	req.body = JSON.parse(JSON.stringify(req.body));

	// validator
	postItemsValidator.validator(req);
	let item = Object.assign(req.body);
	item.group = {
		id:'',
		name:'',
	}
	let errors = req.validationErrors();
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? "edit" : "add";
	if (errors) {
		let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
		let categorysItems = [];
		await CategorysModel.listItemsInSelectbox()
				.then((items)=>{
					categorysItems = items;
				});
		res.render(`${folderView}/form`, { 
			title: pageTitle ,
			item:item,
			errors:errors,
			categorysItems:categorysItems
		});
		res.redirect(link);

	}else{
		let message = (taskCurrent == "add") ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
		PostItemModel.saveItem(item,{task:taskCurrent}).then((result) =>{
			req.flash('success', message);
		});
		res.redirect(link);

	}
});





/************* sort ************/

router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
	// req.session.sort_field 				= ParamHelpers.getParam(req.params,'sort_field','ordering');
	// req.session.sort_type				= ParamHelpers.getParam(req.params,'sort_type','asc');
	
	res.redirect(link);
});


/************* filter group ************/

router.get('/filter-categorys/:categorys_id', function(req, res, next) {
	req.session.categorys_id 				= ParamHelpers.getParam(req.params,'categorys_id','');
	res.redirect(link);
});


module.exports = router;
