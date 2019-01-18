
var notify = require(__path.__path_configs+'notify');
var util = require('util');


var option = {
	name:{min:5,max:30},
	ordering:{min:0,max:100},
	status:{value:'novalue'},
	content:{min:5,max:400}
}

let validator = (req) =>{
	req.checkBody('logo',util.format(notify.VALIDATES.ERROR_NAME,option.name.min,option.name.max)).isLength({min:option.name.min,max:option.name.max});
	req.checkBody('ordering',util.format(notify.VALIDATES.ERROR_ORDERING,option.name.min,option.name.max)).isInt({gt:option.ordering.min,lt:option.ordering.max});
	req.checkBody('status',notify.VALIDATES.ERROR_STATUS).isNotEqual(option.status.value);
	req.checkBody('content',util.format(notify.VALIDATES.ERROR_NAME,option.content.min,option.content.max)).isLength({min:option.content.min,max:option.content.max});
}
module.exports = {
	validator :validator
};