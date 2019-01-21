
var notify = require(__path.__path_configs+'notify');
var util = require('util');


var option = {
	group_name:{min:5,max:100},
	user_name:{min:5,max:100},
	pass_word:{min:5,max:100},
	content:{min:5,max:400}
}

let validator = (req) =>{
	req.checkBody('group',util.format(notify.GROUP_NAME_CONFIGS,option.group_name.min,option.group_name.max)).isLength({min:option.group_name.min,max:option.group_name.max})
	req.checkBody('username',util.format(notify.USER_NAME_CONFIGS,option.user_name.min,option.user_name.max)).isLength({min:option.user_name.min,max:option.user_name.max})
	req.checkBody('password',util.format(notify.PASS_WORD_CONFIGS,option.pass_word.min,option.pass_word.max)).isLength({min:option.pass_word.min,max:option.pass_word.max})
	req.checkBody('email',util.format(notify.EMAIL_CONFIGS)).isEmail()
}
module.exports = {
	validator :validator
};