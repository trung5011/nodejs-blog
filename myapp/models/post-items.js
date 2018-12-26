var PostItemModel = require(__path.__path_schema + 'post-items');


module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;


		if(params.categorys_id !== 'allvalue' && params.categorys_id !== '') objwhere['group.id'] = params.categorys_id;
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return PostItemModel
			.find(objwhere)
			.select()
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	
	getItem:(id,option=null) =>{
		return PostItemModel.findById(id);
	},

	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.categorys_id !== 'allvalue' && params.categorys_id !== '') objwhere['group.id'] = params.categorys_id;
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return PostItemModel.countDocuments(objwhere)
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
			return PostItemModel.update({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return PostItemModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem:(id,options=null) => {
		if(options.task === 'delete-one'){
			return PostItemModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			return PostItemModel.remove({_id:{$in:id}});
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
				await PostItemModel
					.update({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return PostItemModel.update({_id:cids},data);
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
				name:item.categorys_name
			}
			return new PostItemModel(item).save();
		}
		// edit item in forms
		if(options.task === "edit") {
			return PostItemModel.updateOne({_id:item.id},{
				name:item.name,
				status:item.status,
				ordering:parseInt(item.ordering),
				content:item.content,
				slug:item.slug,
				modified:{
					user_id:0,
					user_name:"admin",
					time: Date.now()
				},
				group : {
					id:item.categorys_id,
					name:item.categorys_name
				}
			});
		}
			// edit item in form
			if(options.task === "change-categorys-name") {
				return PostItemModel.updateMany({'group.id':item.id},{
					group : {
						name:item.category_id,
					}
				});
			}
	}
}