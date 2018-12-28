var express     	= require('express');
var router       	= express.Router();
var md5 				= require('md5');




var UsersModel   	= require(__path.__path_models+'users');
var GroupsModel   	= require(__path.__path_models+'groups');
var notify   		= require(__path.__path_configs+'notify');
var FileHelper   		= require(__path.__path_helpers+'file');
var userValidator   = require(__path.__path_validates+'users');
var UtilsHelpers 	= require(__path.__path_helpers+'utils');
var ParamHelpers 	= require(__path.__path_helpers+'params');
var systemConfig 	= require(__path.__path_configs+'systems');
var util 			= require('util');
var link 			= `/${systemConfig.prefixAdmin}/users/list`;
var folderView 		= __path.__path_views+'page/backend/users' ;

var pageTitleIndex 	= 'Users Management - List';
var pageTitleAdd 	= pageTitleIndex + ' - Add';
var pageTitleEdit 	= pageTitleIndex + ' - Edit';
var UploadAvatar 	= FileHelper.uploadFile(field='avatar',folderDes = 'users',fileNameLength = 20,fileSizeMb = 5,fileExtension ='jpeg|jpg|png|gif');
var folderUpload = 'public/uploads/users/';


/************* GET users listing. ************/

router.get('/list(/:status)?', async function(req, res, next) {
	let params = {};
	params.keyword 		= ParamHelpers.getParam(req.query,'keywords','');;
	params.currentStatus 	= ParamHelpers.getParam(req.params,'status','all');;
	let statusFilter 	= await UtilsHelpers.createFilterStatus(params.currentStatus,'users');
	params.sortField 		= ParamHelpers.getParam(req.session,'sort_field','oreding');
	params.sortType 		= ParamHelpers.getParam(req.session,'sort_type','asc');
	params.groupID 		= ParamHelpers.getParam(req.session,'group_id','');
	
	// pagination
	params.pagination = {
		totalItems:0,
		currentPage:parseInt(ParamHelpers.getParam(req.query,'page',1)),
		totalPages:0,
		totalItemsPerPage:4,
		pageRanges:3
	}

	let groupItems = [];
	await GroupsModel.listItemsInSelectbox()
			.then((items)=>{
				groupItems = items;
			});

	
	await UsersModel
		.countItem(params).then((data)=>{
		params.pagination.totalItems = data;
		params.pagination.totalPages = Math.ceil(params.pagination.totalItems/params.pagination.totalItemsPerPage);
	});

	UsersModel.listItems(params,null)
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
			groupItems:groupItems,
			groupID:params.groupID
		});
	})
});



/************* changstatus ************/


router.get('/change-status/:id/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	let id 				= ParamHelpers.getParam(req.params,'id','');

	UsersModel
		.changeStatus(currentStatus,id,{task:'update-one'})
		.then((result) => {
		req.flash('success',notify.CHANGE_STATUS_SUCCES, false);
		res.redirect(link);
	})
  });

router.post('/change-status/:status', function(req, res, next) {
	let currentStatus 	= ParamHelpers.getParam(req.params,'status','active');;
	
	UsersModel
		.changeStatus(currentStatus,req.body.cid,{task:'update-multi'})
		.then((result) =>{
		req.flash('success', util.format(notify.CHANGE_STATUS_MULTI_SUCCESS,result.n), false);
		res.redirect(link);
	})
});




/************* delete item ************/

router.get('/delete/:id', function(req, res, next) {
	let id 				= ParamHelpers.getParam(req.params,'id','');
	UsersModel.deleteItem(id,{task:'delete-one'}).then((result) =>{
		req.flash('success', notify.DELETE_SUCCESS, false);
		res.redirect(link);
	})
});

router.post('/delete', function(req, res, next) {
	let id 				= req.body.cid;
	UsersModel.deleteItem(id,{task:'delete-multi'}).then((result) =>{
		req.flash('success', util.format(notify.DELETE_MULTI_SUCCESS,result.n), false);
		res.redirect(link);
	})
});



/************* change ordering ************/

router.post('/save-ordering', function(req, res, next) {
	let cids 		= req.body.cid;
	let orderings 	= req.body.ordering;
	UsersModel.changeOrdering(cids,orderings,null).then((result)=>{
		req.flash('success', notify.CHANGE_ORDERING_SUCCESS, false);
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
	let groupItems = [];
	await GroupsModel.listItemsInSelectbox().then((items)=>{
		groupItems = items;
	});
			

	if (id === ''){
		res.render(`${folderView}/form`, { 
			title: pageTitleAdd ,
			item:item,
			errors:errors,
			groupItems:groupItems
		});
	}else{
		UsersModel.getItem(id).then((result) =>{
			res.render(`${folderView}/form`, { 
				title: pageTitleEdit ,
				item:result,
				errors:errors,
				groupItems:groupItems
			});
		});
	}
  });




/************* add and edit item ************/

router.post('/save',  function(req, res, next) {

	UploadAvatar (req,res, async (errUpload) => {

		req.body = JSON.parse(JSON.stringify(req.body));

		let item = Object.assign(req.body);
		let taskCurrent = (typeof item !== "undefined" && item.id !== "") ? "edit" : "add";

		// validator
		let errors = userValidator.validator(req,errUpload,taskCurrent);
		item.pass_word = md5(item.pass_word);
		if (errors.length > 0) {
			let pageTitle = (taskCurrent == "add") ? pageTitleAdd : pageTitleEdit;
			if(req.file !=  undefined) FileHelper.removeFile(folderUpload,req.file.filename);
			let groupItems = [];
			await GroupsModel.listItemsInSelectbox()
					.then((items)=>{
						groupItems = items;
					});
			item.group = {
				id:item.group_id,
				name:item.group_name
			};

			if(taskCurrent == 'edit') item.avatar = item.image_old;
			res.render(`${folderView}/form`, { 
				title: pageTitle ,
				item:item,
				errors:errors,
				groupItems:groupItems
			});
		}else{
			let message = (taskCurrent == "add") ? notify.ADD_SUCCESS : notify.EDIT_SUCCESS;
			if(req.file == undefined ){ // user no edit avatar
				item.avatar = item.image_old;
			}else{ // user edit avatar
				item.avatar = req.file.filename;
				if(taskCurrent == 'edit') FileHelper.removeFile(folderUpload,item.image_old);
			}

			item.avatar = (req.file != undefined) ? req.file.filename : item.avatar;
			UsersModel.saveItem(item,{task:taskCurrent}).then((result) =>{
				req.flash('success', message, false);
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

router.get('/filter-group/:group_id', function(req, res, next) {
	req.session.group_id 				= ParamHelpers.getParam(req.params,'group_id','');
	res.redirect(link);
});

/************* upload ************/

// router.get('/upload', function(req, res, next) {
// 	res.render(`${folderView}/upload`, {
// 		pageTitle:pageTitleIndex,
// 	});
// });



module.exports = router;
