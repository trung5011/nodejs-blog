var SettingsModel = require(__path.__path_schema + 'settings');


module.exports = {
	listItems:(params,options=null) => {
		return SettingsModel.find();
	},
	getItem:(id,option=null) =>{
		return SettingsModel.findById(id);
	},
	countItem:(params,options=null) => {
		let objwhere = {};
		if(params.currentStatus !== 'all') objwhere.status = params.currentStatus;
		if(params.keyword !== '') objwhere.name = new RegExp(params.keyword,'i');
		return SettingsModel.countDocuments(objwhere);
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
		await SettingsModel.find().then((result)=>{

			if(result.length>0&&result != undefined){
				x = false;
			}else{
				x = true;
			}
		});

		if(x == true){
			return new SettingsModel(items).save();
		}
		return SettingsModel.updateOne(items);

	}
}