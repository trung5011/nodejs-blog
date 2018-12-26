const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		name: String,
		status: String,
		ordering: Number,
		created :{
			user_id: Number,
			user_name:String,
			time:Date
		},
		content:String,
		modified :{
			user_id: Number,
			user_name:String,
			time:Date
		}
	});

module.exports = mongoose.model('item',schema);