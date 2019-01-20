const mongoose = require('mongoose');

var schema = new mongoose.Schema(
	{ 
		user_name: String,
		pass_word: String,
		email: String,
		database:String
	});

module.exports = mongoose.model('confirgs',schema); 