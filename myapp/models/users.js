var UsersModel 		= require(__path.__path_schema + 'users');
var FileHelper   		= require(__path.__path_helpers+'file');
var folderUpload = 'public/uploads/users/';

module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;


		if(params.groupID !== 'allvalue' && params.groupID !== '') objwhere['group.id'] = params.groupID;
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return UsersModel
			.find(objwhere)
			.select()
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	
	getItem:(id,option=null) =>{
		return UsersModel.findById(id);
	},

	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.groupID !== 'allvalue' && params.groupID !== '') objwhere['group.id'] = params.groupID;
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return UsersModel.countDocuments(objwhere)
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
			return UsersModel.update({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return UsersModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem: async (id,options=null) => {
		if(options.task === 'delete-one'){
			await UsersModel.findById(id).then((item)=>{
				FileHelper.removeFile(folderUpload,item.avatar);
			});
			return UsersModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			if(Array.isArray()){
				for(let i = 0;i<id.length;i++){
					await UsersModel.findById(id[i]).then((item)=>{
						FileHelper.removeFile(folderUpload,item.avatar);
					});
				}
			}else{
				await UsersModel.findById(id).then((item)=>{
					FileHelper.removeFile(folderUpload,item.avatar);
				});
			}
			return UsersModel.deleteMany({_id:{$in:id}});
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
				await UsersModel
					.update({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return UsersModel.update({_id:cids},data);
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
				id:item.group_id,
				name:item.group_name
			}
			return new UsersModel(item).save();
		}
		// edit item in form
		if(options.task === "edit") {
			return UsersModel.updateOne({_id:item.id},{
				name:item.name,
				status:item.status,
				ordering:parseInt(item.ordering),
				content:item.content,
				avatar:item.avatar,
				modified:{
					user_id:0,
					user_name:"admin",
					time: Date.now()
				},
				group : {
					id:item.group_id,
					name:item.group_name
				}
			});
		}
			// edit item in form
			if(options.task === "change-group-name") {
				return UsersModel.updateMany({'group.id':item.id},{
					group : {
						name:item.group_name
					}
				});
			}
	}
}