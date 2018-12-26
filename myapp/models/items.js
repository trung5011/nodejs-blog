var ItemsModel = require(__path.__path_schema + 'items');


module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;

		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return ItemsModel
			.find(objwhere)
			.select('name status ordering created modified')
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	getItem:(id,option=null) =>{
		return ItemsModel.findById(id);
	},
	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return ItemsModel.countDocuments(objwhere);
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
			return ItemsModel.update({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return ItemsModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem:(id,options=null) => {
		if(options.task === 'delete-one'){
			return ItemsModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			return ItemsModel.remove({_id:{$in:id}});
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
				await ItemsModel
					.update({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return ItemsModel.update({_id:cids},data);
		}
	},
	saveItem: (item,options = null) => {
		if(options.task === "add"){
			item.created = {
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
			
			return new ItemsModel(item).save();
		}
		if(options.task === "edit") {
			return ItemsModel.updateOne({_id:item.id},{
				name:item.name,
				status:item.status,
				ordering:parseInt(item.ordering),
				content:item.content,
				modified:{
					user_id:0,
					user_name:"admin",
					time: Date.now()
				}
			});
		}
	}
}