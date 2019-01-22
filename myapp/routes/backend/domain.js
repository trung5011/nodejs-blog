var express      = require('express');
var router       = express.Router();
var DomainModel   = require(__path.__path_models+'domain');
var ArticleModel   = require(__path.__path_models+'article');
var notify   = require(__path.__path_configs+'notify');
var domainValidator   = require(__path.__path_validates+'domain');
var UtilsHelpers = require(__path.__path_helpers+'utils');
var ParamHelpers = require(__path.__path_helpers+'params');
var systemConfig = require(__path.__path_configs+'systems');
var util = require('util');
var link = `/${systemConfig.prefixAdmin}/domain/list`;
var folderView = __path.__path_views+'page/backend/domain' ;

var pageTitleIndex 	= 'Domain Management - List';
var pageTitleAdd 	= pageTitleIndex + ' - Add';
var pageTitleEdit 	= pageTitleIndex + ' - Edit';




/************* GET users listing. ************/

router.get('/list(/:status)?', async function(req, res, next) {
	let params 				= {};
	params.keyword 			= ParamHelpers.getParam(req.query,'keywords','');;
	params.currentStatus 	= ParamHelpers.getParam(req.params,'status','all');;
	let statusFilter 		= await UtilsHelpers.createFilterStatus(params.currentStatus,'items');
	params.sortField 		= ParamHelpers.getParam(req.session,'sort_field','oreding');
	params.sortType 		= ParamHelpers.getParam(req.session,'sort_type','asc');
	
	// pagination
	params.pagination = {
		totalItems:0,
		currentPage:parseInt(ParamHelpers.getParam(req.query,'page',1)),
		totalPages:0,
		totalItemsPerPage:4,
		pageRanges:3
	}
	await DomainModel
		.countItem(params).then((data)=>{
			params.pagination.totalItems = data;
			params.pagination.totalPages = Math.ceil(params.pagination.totalItems/params.pagination.totalItemsPerPage);
	});

	DomainModel.listItems(params)
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


/************* chang groups-acp ************/

// router.get('/change-group-acp/:id/:group_acp', function(req, res, next) {
// 	let currentGroupACP 	= ParamHelpers.getParam(req.params,'group_acp','yes');;
// 	let id 				= ParamHelpers.getParam(req.params,'id','');
// 	DomainModel.changeGroupACP(currentGroupACP,id).then((result) =>{
// 		req.flash('success',notify.CHANGE_GROUPACP_SUCCES);
// 		res.redirect(link);

// 	})
// });






/************* changstatus ************/

router.get('/change-status/:id/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	let id 				= ParamHelpers.getParam(req.params,'id','');

	DomainModel
		.changeStatus(currentStatus,id,{task:'update-one'})
		.then((result) => {
		req.flash('success',notify.CHANGE_STATUS_SUCCESS);
		res.redirect(link);
	})
  });

router.post('/change-status/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	
	DomainModel
		.changeStatus(currentStatus,req.body.cid,{task:'update-multi'})
		.then((result) =>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});



/************* delete item ************/

router.get('/delete/:id', function(req, res, next) {
	let id 				= ParamHelpers.getParam(req.params,'id','');
	DomainModel.deleteItem(id,{task:'delete-one'}).then((result) =>{
		req.flash('success', notify.DELETE_SUCCESS);
		res.redirect(link);
	})
});

router.post('/delete', function(req, res, next) {
	let id 				= req.body.cid;
	DomainModel.deleteItem(id,{task:'delete-multi'}).then((result) =>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});



/************* change ordering ************/

router.post('/save-ordering', function(req, res, next) {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	DomainModel.changeOrdering(cids,orderings,null).then((result)=>{
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS);
		res.redirect(link);
	});
});


/************* form item ************/


router.get('/form(/:id)?', function(req, res, next) {
	let id 		= ParamHelpers.getParam(req.params,'id','');;
	let item    = {
		name:'',
		status:'',
		ordering:''
	}
	let errors = null;
	if (id === ''){
		res.render(`${folderView}/form`, { 
			title: pageTitleAdd ,
			item:item,
			errors:errors
		});
	}else{
		DomainModel.getItem(id).then((result) =>{
			res.render(`${folderView}/form`, { 
				title: pageTitleEdit ,
				item:result,
				errors:errors
			});
		});
	}
  });




/************* add and edit item ************/

router.post('/save', function(req, res, next) {
	req.body = JSON.parse(JSON.stringify(req.body));

	// validator
	domainValidator.validator(req);
	let item = Object.assign(req.body);
	let errors = req.validationErrors();
	let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? "edit" : "add";


	if (errors) {
		let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
		res.render(`${folderView}/form`, { 
			title: pageTitle,
			item:item,
			errors:errors
		});
	}else{
		let message = (taskCurrent == "add") ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
		DomainModel.saveItem(item,{task:taskCurrent}).then((result) =>{
			if(taskCurrent == "add"){
				req.flash('success', message);
				res.redirect(link);
			}else if(taskCurrent == "edit"){
				ArticleModel.saveItem(item,{task:'change-domain'}).then((results) =>{
					req.flash('success', message);
					res.redirect(link);
				});
			}
			
		})
	}
});





/************* sort ************/

router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
	req.session.sort_field 				= ParamHelpers.getParam(req.params,'sort_field','ordering');
	req.session.sort_type				= ParamHelpers.getParam(req.params,'sort_type','asc');
	
	res.redirect(link);
});




module.exports = router;
