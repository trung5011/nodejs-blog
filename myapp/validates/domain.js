
var notify = require(__path.__path_configs+'notify');
var util = require('util');


var option = {
	name:{min:5,max:100},
	slug:{min:5,max:100},
	ordering:{min:0,max:1000},
	status:{value:'novalue'},
	content:{min:5,max:1000}
}

let validator = (req) =>{
	req.checkBody('name',util.format(notify.VALIDATES.ERROR_NAME,option.name.min,option.name.max)).isLength({min:option.name.min,max:option.name.max});
	req.checkBody('ordering',util.format(notify.VALIDATES.ERROR_ORDERING,option.name.min,option.name.max)).isInt({gt:option.ordering.min,lt:option.ordering.max});
	req.checkBody('status',notify.VALIDATES.ERROR_STATUS).isNotEqual(option.status.value);
	req.checkBody('slug',util.format(notify.VALIDATES.ERROR_NAME,option.slug.min,option.slug.max)).isLength({min:option.slug.min,max:option.slug.max});
	req.checkBody('content',util.format(notify.VALIDATES.ERROR_NAME,option.content.min,option.content.max)).isLength({min:option.content.min,max:option.content.max});
}
module.exports = {
	validator :validator
};