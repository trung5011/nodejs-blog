var CategorysModel = require(__path.__path_schema + 'categorys');
var ChangeSlug = require(__path.__path_helpers + 'string');


module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;

		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return CategorysModel
			.find(objwhere)
			.select()
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	listItemsFrontend:(params=null,option=null) =>{
		let find = {};
		let select = 'name slug created.user_name created.time';
		let limit = '';
		let sort = {};
		if(option.task == "items-in-menu"){
			find = {status:'active'};
			sort = {ordering:'asc'};
		}
		else if(option.task == "items-categorys"){
			find = {status:'active'};
			sort = {'created.time':'desc'};
		}
		return CategorysModel.find(find).select(select).limit(limit).sort(sort)
	},
	listItemsInSelectbox:() => {
		return CategorysModel.find().select('_id name');
	},
	
	getItem:(id,option=null) =>{
		return CategorysModel.findById(id);
	},
	countItem:(params,options=null) => {
		let objwhere 		= {};
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return CategorysModel.countDocuments(objwhere)
	},
	findSlug:(slugCategorys) => {
		let am = {slug:slugCategorys};
		return CategorysModel.find(am).select('_id');
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
			return CategorysModel.updateOne({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return CategorysModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem:(id,options=null) => {
		if(options.task === 'delete-one'){
			return CategorysModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			return CategorysModel.remove({_id:{$in:id}});
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
				await CategorysModel
					.updateOne({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return CategorysModel.updateOne({_id:cids},data);
		}
	},
	saveItem: (item,options = null) => {
		if(options.task === "add"){
			item.created = {
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
			item.slug=ChangeSlug.createAlias(item.slug);
			
			return new CategorysModel(item).save();
		}
		if(options.task === "edit") {
			return CategorysModel.updateOne({_id:item.id},{
				name:item.name,
				status:item.status,
				ordering:parseInt(item.ordering),
				content:item.content,
				slug:ChangeSlug.createAlias(item.slug),
				modified:{
					user_id:0,
					user_name:"admin",
					time: Date.now()
				}
			});
		}
	}
}