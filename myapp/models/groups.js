var GroupsModel = require(__path.__path_schema + 'groups');


module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;

		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return GroupsModel
			.find(objwhere)
			.select()
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	listItemsInSelectbox:() => {
		return GroupsModel.find().select('_id name');
	},
	changeGroupACP:(currentGroupACP,id) => {
		let GroupACP  			= (currentGroupACP === "yes") ? "no" : "yes";
		let data 			= {
			group_acp:GroupACP,
			modified:{
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
		} 
		return GroupsModel.updateOne({_id:id},data);
	},
	getItem:(id,option=null) =>{
		return GroupsModel.findById(id);
	},
	countItem:(params,options=null) => {
		let objwhere 		= {};
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return GroupsModel.countDocuments(objwhere)
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
			return GroupsModel.updateOne({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return GroupsModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem:(id,options=null) => {
		if(options.task === 'delete-one'){
			return GroupsModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			return GroupsModel.remove({_id:{$in:id}});
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
				await GroupsModel
					.updateOne({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return GroupsModel.updateOne({_id:cids},data);
		}
	},
	saveItem: (item,options = null) => {
		if(options.task === "add"){
			item.created = {
				user_id:0,
				user_name:"admin",
				time: Date.now()
			}
			
			return new GroupsModel(item).save();
		}
		if(options.task === "edit") {
			return GroupsModel.updateOne({_id:item.id},{
				name:item.name,
				status:item.status,
				ordering:parseInt(item.ordering),
				content:item.content,
				group_acp:item.group_acp,
				modified:{
					user_id:0,
					user_name:"admin",
					time: Date.now()
				}
			});
		}
	}
}