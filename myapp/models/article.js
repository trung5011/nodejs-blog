var ArticleItemModel = require(__path.__path_schema + 'article');
var FileHelper   		= require(__path.__path_helpers+'file');
var folderUpload = 'public/uploads/article/';
var StringHelper   		= require(__path.__path_helpers+'string');


module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;


		if(params.categorys_id !== 'allvalue' && params.categorys_id !== '') objwhere['group.id'] = params.categorys_id;
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return ArticleItemModel
			.find(objwhere)
			.select()
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	listItemsFrontend:(params=null,option=null,itemslimit=null) =>{
		let find = {};
		let select = 'name slug group created.user_name created.time thumbnail content excert';
		let limit =  (itemslimit!=null&&itemslimit!=undefined) ? Number(itemslimit) : 5 ;
		let sort = {};
		if(option.task == "items-special"){
			find = {status:'active',special:'active'};
			sort = {ordering:'asc'};
		}
		else if(option.task == "items-news"){
			find = {status:'active'};
			sort = {'created.time':'desc'};
		}
		
		else if(option.task == 'items-other'){
			find = {status:'active','_id':{$ne:params.id},'group.id':params.group.id}
			sort = {ordering:'asc'};
		}
		else if(option.task == 'items-in-categorys'){
			find = (params.slug != '') ? {status:'active','group.id':params.id} : {status:'active'};
			sort = {ordering:'asc'};
		}
		else if(option.task == 'items-random'){
			return 	ArticleItemModel.aggregate([
				{$match:{status:'active'}},
				{$project:{_id:0,name:1,created:1,thumbnail:1}},
				{$sample:{size:limit}}
			]);

		}

		return ArticleItemModel.find(find).select(select).limit(limit).sort(sort)
	},

	getItem:(id,option=null) =>{
		return ArticleItemModel.findById(id);
	},
	getItemFrontend:(slugItem,option=null) =>{
		return ArticleItemModel.find({slug:slugItem}).select('name thumbnail status created content group slug')
	},
	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.categorys_id !== 'allvalue' && params.categorys_id !== '') objwhere['group.id'] = params.categorys_id;
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return ArticleItemModel.countDocuments(objwhere)
	},
	changeSpecial:(currentSpecial,id,options=null) =>{
		let special 			= (currentSpecial === "active") ? "inactive" : "active";
		let data 			= {
			special:special,
			modified:{
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
		} 
		if(options.task === 'update-one'){
			return ArticleItemModel.update({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.special = currentSpecial;
			return ArticleItemModel.updateMany({_id:{$in:id}},data);
		}
	},
	changeStatus:(currentStatus,id,options=null) =>{
		let status 			= (currentStatus === "active") ? "inactive" : "active";
		let data 			= {
			status:status,
			modified:{
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
		} 
		if(options.task === 'update-one'){
			return ArticleItemModel.update({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return ArticleItemModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem:async (id,options=null) => {
		if(options.task === 'delete-one'){
			await ArticleItemModel.findById(id).then((item)=>{
				FileHelper.removeFile(folderUpload,item.avatar);
			});
			return ArticleItemModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			if(Array.isArray()){
				for(let i = 0;i<id.length;i++){
					await ArticleItemModel.findById(id[i]).then((item)=>{
						FileHelper.removeFile(folderUpload,item.avatar);
					});
				}
			}else{
				await ArticleItemModel.findById(id).then((item)=>{
					FileHelper.removeFile(folderUpload,item.avatar);
				});
			}
			return ArticleItemModel.deleteMany({_id:{$in:id}});
		}
	},
	changeOrdering: async (cids,orderings,options=null) =>{
	
		let data 			= {
			ordering:parseInt(orderings),
			modified:{
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
		} 

		if(Array.isArray(cids)){
		
			for(let index = 0; index < cids.length;index++){
				data.ordering = parseInt(orderings[index]);
				await ArticleItemModel
					.update({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return ArticleItemModel.update({_id:cids},data);
		}
	},
	saveItem: (item,options = null) => {
		// add item in form
		if(options.task === "add"){
			item.created = {
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
			item.group = {
				id:item.categorys_id,
				name:item.categorys_name,
				slug:StringHelper.createAlias(item.categorys_name)
			}
			return new ArticleItemModel(item).save();
		}
		// edit item in forms
		if(options.task === "edit") {
			return ArticleItemModel.updateOne({_id:item.id},{
				name:item.name,
				status:item.status,
				special:item.special,
				ordering:parseInt(item.ordering),
				content:item.content,
				slug:item.slug,
				thumbnail:item.thumbnail,
				excert:item.excert,
				modified:{
					user_id:0,
					user_name:"admin",
					time: Date.now()
				},
				group : {
					id:item.categorys_id,
					name:item.categorys_name,
					slug:StringHelper.createAlias(item.categorys_name)
				}
			});
		}
			// edit item in form
			if(options.task === "change-categorys-name") {
				return ArticleItemModel.updateMany({'group.id':item.id},{
					group : {
						name:item.category_id,
					}
				});
			}
	}
}