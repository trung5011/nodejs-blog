const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		name: String,
		fullname:String,
		status: String,
		ordering: Number,
		avatar:String,
		user_name:String,
		pass_word:String,
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

module.exports = mongoose.model('users',schema);