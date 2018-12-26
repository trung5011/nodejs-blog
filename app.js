var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


/************* libary ************/

const flash = require('express-flash-notification');
const session = require('express-session');
const validator  = require('express-validator');
const pathFolder = require('./path');
const mongoose = require('mongoose');
var moment = require('moment');

/************* end ************/


/************* Define Path ************/

global.__base = __dirname + '/';
global.__intermediate = __base + 'myapp/';
global.__path = {
	__path_configs:__intermediate + pathFolder.folder_configs +'/',
	__path_helpers:__intermediate + pathFolder.folder_helpers +'/',
	__path_routes:__intermediate + pathFolder.folder_routes +'/',
	__path_schema:__intermediate + pathFolder.folder_schema +'/',
	__path_models:__intermediate + pathFolder.folder_models +'/',
	__path_validates:__intermediate + pathFolder.folder_validates +'/',
	__path_views:__intermediate + pathFolder.folder_view +'/',
	__path_public:__base + pathFolder.folder_public +'/',
	__path_uploads:__base+'public/' + pathFolder.folder_uploads + '/',
}

/************* end ************/



const systemConfig = require(__path.__path_configs + 'systems');
var indexAdminRouter = require(__path.__path_routes+'backend/index');
var indexRouter = require(__path.__path_routes+'frontend/index');

/************* connect database ************/

mongoose.connect('mongodb://127.0.0.1/demo', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error',() =>{
	console.log('connection error123');
});
db.once('open',() => {
	console.log('connected');
});

/************* end ************/







var app = express();
app.use(cookieParser());
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true
}));
app.use(validator({
	customValidators:{
		isNotEqual:(value1,value2) =>{
			return value1 !== value2;
		}
	}
}));

/************* notification ************/

app.use(flash(app,{
	sessionName: 'item',
	utilityName: 'flash',
	localsName: 'flash',
	viewName:__path.__path_views + 'layout/backend/elements/notification',
	beforeSingleRender: function(notification, callback) {
		if (notification.type) {
		  switch(notification.type) {
			case 'error':
			  notification.alert_class = 'danger'
			break;
			case 'success':
			  notification.alert_class = 'success'
			break;
		  }
		}
		callback(null, notification)
	},
	afterAllRender: function(htmlFragments, callback) {
		// Naive JS is appened, waits a while expecting for the DOM to finish loading,
		// The timeout can be removed if jOuery is loaded before this is called, or if you're using vanilla js.
		htmlFragments.push([
		  `<script type="text/javascript">
				setTimeout(function(){
					$('.alert-dismissable .close').trigger('click');
				},6000);
		  </script>`
		].join(''))
		callback(null, htmlFragments.join(''))
	  },
}));

/************* end ************/


/************* view engine setup  ************/

app.set(__path.__path_views+'views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/************* end ************/


// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));


/************* local variable ************/

app.locals.system = systemConfig;
app.locals.moment = moment;

/************* end ************/


app.use(`/${systemConfig.prefixAdmin}`, indexAdminRouter);
app.use(`(/${systemConfig.prefixBlog})?`, indexRouter);


/************* catch 404 and forward to error handler  ************/

app.use(function(req, res, next) {
  next(createError(404));
});

/************* end ************/


/************* error handler ************/

app.use( async function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  if(systemConfig.env == "dev"){
		// render the error page
	res.status(err.status || 500);
	res.render(__path.__path_views+'error',{title :'error page'});
  }
  if(systemConfig.env == "production"){
	var CategorysModel   = require(__path.__path_models+'categorys');
	let itemsCategorys =[];
	var folderView = __path.__path_views +'page/frontend/page/404';

	await CategorysModel.listItemsFrontend(null,{task:'items-in-menu'}).then((items)=>{
		itemsCategorys = items
	})
	res.render(folderView, { 
		pageTitle:'404 page',
		top_posts:false,
		itemsCategorys
	});
  }
 
});

/************* end ************/


module.exports = app;
