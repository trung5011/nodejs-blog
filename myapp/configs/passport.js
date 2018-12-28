var UsersModel   		= require(__path.__path_models+'users');
var md5 				= require('md5');
var notify   			= require(__path.__path_configs+'notify');
var passport 			= require('passport');
var LocalStrategy 		= require('passport-local').Strategy;

module.exports = (passport)=>{
	/************* config passport ************/
	passport.use(new LocalStrategy(
		async function  (username, password, done) {
			let user;
			await UsersModel.getItemByUsername(username,null).then((users)=>{
				user = users[0];
			});
			if(!user){
				return done(null,false,{message:notify.ERROR_USER_EXITS});
			}else{
				if(md5(password)!== user.pass_word){
					return done(null,false,{message:notify.ERROR_LOGIN_EXITS});
				}else{
					return done(null,user,{message:notify.ERROR_LOGIN_EXITS});
				}
			}
		}
	));

	passport.serializeUser(function(user,done){
		done(null,user._id);
	});

	passport.deserializeUser(function(id,done){
		UsersModel.getItem(id,null).then((user)=>{
			done(null,user);
		});
	});
}