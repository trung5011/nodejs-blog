var express      = require('express');
var router       = express.Router();
var ArticleItemModel   = require(__path.__path_models+'article');
var CategorysModel   = require(__path.__path_models+'categorys');
var notify   = require(__path.__path_configs+'notify');
var FileHelper   		= require(__path.__path_helpers+'file');
var StringHelper   		= require(__path.__path_helpers+'string');

var articleItemsValidator   = require(__path.__path_validates+'article');
var UtilsHelpers = require(__path.__path_helpers+'utils');
var ParamHelpers = require(__path.__path_helpers+'params');
var systemConfig = require(__path.__path_configs+'systems');
var util = require('util');
var link = `/${systemConfig.prefixAdmin}/article/list`;
var folderView = __path.__path_views+'page/backend/article' ;
var pageTitleIndex 	= 'Article Management - List';
var pageTitleAdd 	= pageTitleIndex + ' - Add';
var pageTitleEdit 	= pageTitleIndex + ' - Edit';
var folderUpload = 'public/uploads/article/';

var UploadThumbnail 	= FileHelper.uploadFile(field='thumbnail',folderDes = 'article',fileNameLength = 20,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif');



/************* GET article listing. ************/

router.get('/list(/:status)?', async function(req, res, next) {
	let params = {};
	params.keyword 		= ParamHelpers.getParam(req.query,'keywords','');
	params.currentStatus 	= ParamHelpers.getParam(req.params,'status','all');
	let statusFilter 	= await UtilsHelpers.createFilterStatus(params.currentStatus,'article');
	params.sortField 		= ParamHelpers.getParam(req.session,'sort_field','oreding');
	params.sortType 		= ParamHelpers.getParam(req.session,'sort_type','asc');
	params.categorys_id 		= ParamHelpers.getParam(req.session,'categorys_id','');
	
	// pagination
	params.pagination = {
		totalItems:0,
		currentPage:parseInt(ParamHelpers.getParam(req.query,'page',1)),
		totalPages:0,
		totalItemsPerPage:10,
		pageRanges:3
	}

	let categorysItems = [];
	await CategorysModel.listItemsInSelectbox()
			.then((items)=>{
				categorysItems = items;
			});

	
	await ArticleItemModel
		.countItem(params).then((data)=>{
		params.pagination.totalItems = data;
		params.pagination.totalPages = Math.ceil(params.pagination.totalItems/params.pagination.totalItemsPerPage);
	});

	ArticleItemModel.listItems(params,null)
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

	ArticleItemModel
		.changeStatus(currentStatus,id,{task:'update-one'})
		.then((result) => {
		req.flash('success',notify.CHANGE_STATUS_SUCCESS);
		res.redirect(link);
	})
  });

router.post('/change-status/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	
	ArticleItemModel
		.changeStatus(currentStatus,req.body.cid,{task:'update-multi'})
		.then((result) =>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});


/************* chang special ************/


router.get('/change-special/:id/:special', function(req, res, next) {
	let currentSpecial 	= ParamHelpers.getParam(req.params,'special','active');;
	let id 				= ParamHelpers.getParam(req.params,'id','');

	ArticleItemModel
		.changeSpecial(currentSpecial,id,{task:'update-one'})
		.then((result) => {
		req.flash('success',notify.CHANGE_SPECIAL_SUCCESS);
		res.redirect(link);
	})
  });

router.post('/change-special/:special', function(req, res, next) {
	let currentSpecial 	= ParamHelpers.getParam(req.params,'special','active');;
	
	ArticleItemModel
		.changeSpecial(currentSpecial,req.body.cid,{task:'update-multi'})
		.then((result) =>{
		req.flash('success', util.format(notify.CHANGE_SPECIAL_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});




/************* delete item ************/

router.get('/delete/:id', function(req, res, next) {
	let id 				= ParamHelpers.getParam(req.params,'id','');
	ArticleItemModel.deleteItem(id,{task:'delete-one'}).then((result) =>{
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(link);
	})
});

router.post('/delete', function(req, res, next) {
	let id 				= req.body.cid;
	ArticleItemModel.deleteItem(id,{task:'delete-multi'}).then((result) =>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS,result.n));
		res.redirect(link);
	})
});



/************* change ordering ************/

router.post('/save-ordering', function(req, res, next) {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	ArticleItemModel.changeOrdering(cids,orderings,null).then((result)=>{
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
			name:'',
			slug:''
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
		ArticleItemModel.getItem(id).then((result) =>{
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

router.post('/save',  function(req, res, next) {
	UploadThumbnail (req,res, async (errUpload) => {
		req.body = JSON.parse(JSON.stringify(req.body));


		let item = Object.assign(req.body);

		let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? "edit" : "add";
		item.group = {
			id:'',
			name:'',
			slug:'',
		}
		// validator
		let errors = articleItemsValidator.validator(req,errUpload,taskCurrent);


		if (errors.length > 0) {
			let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
			if(req.file !=  undefined) FileHelper.removeFile(folderUpload,req.file.filename);
			let categorysItems = [];
			await CategorysModel.listItemsInSelectbox()
					.then((items)=>{
						categorysItems = items;
					});
			item.group = {
				id:item.categorys_id,
				name:item.categorys_name,
				slug:StringHelper.createAlias(item.categorys_name)
			};

			if(taskCurrent == 'edit') item.thumbnail = item.image_old;
			res.render(`${folderView}/form`, { 
				title: pageTitle ,
				item:item,
				errors:errors,
				categorysItems:categorysItems
			});
		}else{
			let message = (taskCurrent == "add") ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
			if(req.file == undefined ){ // user no edit avatar
				item.thumbnail = item.image_old;
			}else{ // user edit thumbnail
				item.thumbnail = req.file.filename;
				if(taskCurrent == 'edit') FileHelper.removeFile(folderUpload,item.image_old);
			}
			item.thumbnail = (req.file != undefined) ? req.file.filename : item.thumbnail;
			item.excert = item.content.replace(/(<([^>]+)>)/ig,"");
			ArticleItemModel.saveItem(item,{task:taskCurrent}).then((result) =>{
				req.flash('success', message);
				res.redirect(link);
			});

		}
	});
});





/************* sort ************/

router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
	req.session.sort_field 				= ParamHelpers.getParam(req.params,'sort_field','ordering');
	req.session.sort_type				= ParamHelpers.getParam(req.params,'sort_type','asc');
	
	res.redirect(link);
});


/************* filter group ************/

router.get('/filter-categorys/:categorys_id', function(req, res, next) {
	req.session.categorys_id 				= ParamHelpers.getParam(req.params,'categorys_id','');
	res.redirect(link);
});


module.exports = router;
