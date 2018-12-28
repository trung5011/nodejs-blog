
var notify = require(__path.__path_configs+'notify');
var util = require('util');


var option = {
	user:{min:3,max:20},
	pass:{min:3,max:20},
	
}

let validator = (req) =>{
	req.checkBody('username',util.format(notify.VALIDATES.ERROR_LOGIN_USERNAME,option.user.min,option.user.max)).isLength({min:option.user.min,max:option.user.max});
	req.checkBody('password',util.format(notify.VALIDATES.ERROR_LOGIN_PASSWORD,option.pass.min,option.pass.max)).isLength({min:option.pass.min,max:option.pass.max});
	
}
module.exports = {
	validator :validator
};