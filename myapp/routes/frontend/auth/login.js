/************* system ************/
var express      		= require('express');
var router       		= express.Router();

/************* libarry ************/
var passport 			= require('passport');
var LocalStrategy 		= require('passport-local').Strategy;

/************* my config ************/
var loginValidator   	= require(__path.__path_validates+'login');
var systemConfig 		= require(__path.__path_configs+'systems');

/************* link ************/
var linkIndex 			= `/${systemConfig.prefixAdmin}/`;
var linkLogin 			= '/auth/login';

/************* link folder ************/
var folderView 			= __path.__path_views+'page/frontend/auth/login' ;
var layoutLogin			= __path.__path_views+'login' ;

var pageTitleIndex 		= 'Login';



/************* logout ************/
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect(linkLogin);
});

/************* login ************/
router.get('/login', function(req, res, next) {
	if(req.isAuthenticated()){
		res.redirect(linkIndex);
	} else{
		let item = {email:'','password':''};
		let errors = null;
		res.render(folderView, { 
			layout:layoutLogin,
			errors,
			item,
			pageTitleIndex
		});
	}
});

router.post('/login', function(req, res, next) {
	if(req.isAuthenticated()){
		res.redirect(linkIndex);
	} else{
		req.body = JSON.parse(JSON.stringify(req.body));
		loginValidator.validator(req);
		let item = Object.assign(req.body);
		let errors = req.validationErrors();
		if(errors){
			res.render(folderView, { 
				layout:layoutLogin,
				item,
				errors,
				pageTitleIndex
			});
		}else{
			passport.authenticate('local', { 
				successRedirect: linkIndex,
				failureRedirect: linkLogin,
				failureFlash:true
				 }
			)(req, res, next);
	
		}
	}
});

module.exports = router;
