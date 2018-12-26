const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		name: String,
		fullname:String,
		status: String,
		ordering: Number,
		slug:String,
		group:{
			id:String,
			name:String
		},
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

module.exports = mongoose.model('post-items',schema);