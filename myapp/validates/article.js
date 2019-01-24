
var notify = require(__path.__path_configs+'notify');
var util = require('util');


var option = {
	name:{min:5,max:200},
	ordering:{min:0,max:100},
	status:{value:'novalue'},
	group:{value:'allvalue'},
	content:{min:5,max:10000}
}

let validator = (req,errUpload,taskCurrent) =>{
	req.checkBody('name',util.format(notify.VALIDATES.ERROR_NAME,option.name.min,option.name.max))
							.isLength({min:option.name.min,max:option.name.max});


	req.checkBody('ordering',util.format(notify.VALIDATES.ERROR_ORDERING,option.name.min,option.name.max))
								.isInt({gt:option.ordering.min,lt:option.ordering.max});

	req.checkBody('status',notify.VALIDATES.ERROR_STATUS).isNotEqual(option.status.value);

	req.checkBody('categorys_id',notify.VALIDATES.ERROR_GROUP).isNotEqual(option.group.value);
	req.checkBody('domain_id',notify.VALIDATES.ERROR_GROUP).isNotEqual(option.group.value);
	
	req.checkBody('content',util.format(notify.VALIDATES.ERROR_NAME,option.content.min,option.content.max))
								.isLength({min:option.content.min,max:option.content.max});

	
	let errors = (req.validationErrors() !== false) ? req.validationErrors() : [];

	if(errUpload){
		if(errUpload.code == 'LIMIT_FILE_SIZE'){
			errUpload = notify.VALIDATES.ERROR_FILE_LIMIT;
		}
		errors.push({param:'avatar', msg:errUpload});
	}else{
		if(req.file == undefined && taskCurrent == "add"){
			errors.push({param:'avatar', msg:notify.VALIDATES.ERROR_FILE_REQUIRE});
		}
	}
	return errors;
}
module.exports = {
	validator :validator
};