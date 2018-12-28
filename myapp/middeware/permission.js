/************* module ************/
var groupsModel   		= require(__path.__path_models+'groups');

/************* link config ************/
var linkLogin = '/auth/login';

module.exports = async (req,res,next)=>{
	if(req.isAuthenticated()){
		let permission;
		await groupsModel.getItem(req.user.group.id,null,'group_acp').then((item)=>{
			permission = item.group_acp;
		});
		if(permission=='yes'){
			res.locals.permission=permission;
		}
		next();

	}else{
		res.redirect(linkLogin);
	}
}