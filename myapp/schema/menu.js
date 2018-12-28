const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		name: String,
		status: String,
		ordering: Number,
		slug:String,
		thumbnail:String,
		subMenu:String,
		excert:String,
		created :{
			user_id: Number,
			user_name:String,
			time:Date
		},
		modified :{
			user_id: Number,
			user_name:String,
			time:Date
		}
	});

module.exports = mongoose.model('menu',schema);