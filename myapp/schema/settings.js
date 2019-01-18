const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		logo: String,
		sdt: String,
		email: String,
		linkSocial:{
			facebook:String,
			twitter:String,
			skype:String,
			google:String
			
		},
		copyright:String,
		
	});

module.exports = mongoose.model('settings',schema);