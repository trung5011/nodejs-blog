const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		name: String,
		fullname:String,
		status: String,
		ordering: Number,
		slug:String,
		thumbnail:String,
		special:String,
		excert:String,
		group:{
			id:String,
			name:String,
			slug:String,
		},
		domain:{
			id:String,
			name:String,
			slug:String,
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

module.exports = mongoose.model('article',schema);
