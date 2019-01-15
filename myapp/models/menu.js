var MenuModel = require(__path.__path_schema + 'menu');


module.exports = {
	listItems:(params,options=null) => {
		let objwhere 		= {};
		let sort 			= {};
		sort[params.sortField]		= params.sortType;

		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
	
		return MenuModel
			.find(objwhere)
			.select()
			.sort(sort)
			.skip((params.pagination.currentPage-1)*params.pagination.totalItemsPerPage)
			.limit(params.pagination.totalItemsPerPage)
	},
	getItem:(id,option=null) =>{
		return MenuModel.findById(id);
	},
	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return MenuModel.countDocuments(objwhere);
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
			return MenuModel.update({_id:id},data);
		}
		else if(options.task === 'update-multi'){
			data.status = currentStatus;
			return MenuModel.updateMany({_id:{$in:id}},data);
		}
	},
	deleteItem:(id,options=null) => {
		if(options.task === 'delete-one'){
			return MenuModel.deleteOne({_id:id});
		}
		else if(options.task === 'delete-multi'){
			return MenuModel.remove({_id:{$in:id}});
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
				await MenuModel
					.update({_id:cids[index]},data);
			}
			return Promise.resolve('Success');
		}else{
			return MenuModel.update({_id:cids},data);
		}
	},
	removeAll:()=>{
		 return MenuModel.deleteMany();
		 
	},
	listItemsFrontend:(params=null,option=null)=>{
		let find = {};
		let select = '';
		let limit = '';
		let sort = {};
		if(option.task == "items-in-menu"){
			find = {};
			sort = {ordering:'asc'};
		}
		else if(option.task == "items-categorys"){
			find = {status:'active'};
			sort = {'created.time':'desc'};
		}
		return MenuModel.find(find).select(select).limit(limit).sort(sort)	
	},
	saveItem:async (items) => {
		
		if(items.length>0){
		

			MenuModel.collection.insertMany(items,function(err){
				if(err){
					return console.log(err);
				}
				else{
					console.log('da save database');
				}
			});
		}
		
	}
}