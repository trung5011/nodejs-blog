var ConfigsModel = require(__path.__path_schema + 'configs');


module.exports = {
	listItems:(params,options=null) => {
		return ConfigsModel.find();
	},
	getItem:(id,option=null) =>{
		return ConfigsModel.findById(id);
	},
	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return ConfigsModel.countDocuments(objwhere);
	},
	
	
	saveItem: async (item,options = null) => {

		let items = {
			logo:item.logo,
			sdt:item.sdt,
			linkSocial:{
				facebook:item.facebook,
				twitter:item.twitter,
				skype:item.skype,
				google:item.google
			},
			email:item.email,
			copyright:item.copyright
		}

		let x ;
		await ConfigsModel.find().then((result)=>{
			if(result.length>0&&result != undefined){
				x = false;
			}else{
				x = true;
			}
		});

		if(x == true){
			return new ConfigsModel(items).save();
		}
		return ConfigsModel.updateOne(items);

	},
	saveItemConfigs: (item,options=null) =>{
		let items = {
			logo:'',
			sdt:'',
			linkSocial:{
				facebook:'',
				twitter:'',
				skype:'',
				google:''
			},
			email:item.email,
			copyright:''
		}
		return new ConfigsModel(items).save();

	},

}