var createError 		= require('http-errors');
var express 			= require('express');
var path 				= require('path');
var cookieParser 		= require('cookie-parser');
var logger 				= require('morgan');

var router = express.Router();
/************* libary ************/
const passport 			= require('passport');
const flash 			= require('connect-flash');
const session 			= require('express-session');
const validator  		= require('express-validator');
const pathFolder 		= require('./path');
const mongoose 			= require('mongoose');
var   moment 			= require('moment');




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
	__path_middeware:__intermediate + pathFolder.folder_middeware +'/',
	__path_public:__base + pathFolder.folder_public +'/',
	__path_uploads:__base+'public/' + pathFolder.folder_uploads + '/',
}

/************* model ************/
var UsersModel   		= require(__path.__path_schema+'users');



const systemConfig = require(__path.__path_configs + 'systems');
var indexAdminRouter = require(__path.__path_routes+'backend/index');
var ApiRouter = require(__path.__path_routes+'backend/api/version-1');
var indexRouter = require(__path.__path_routes+'frontend/index');
var configsRouter = require(__path.__path_routes+'backend/configs');










/************* connect database ************/

mongoose.connect('mongodb://127.0.0.1/demo', { useNewUrlParser: true });
// mongoose.connect('mongodb://nodejsnew:thanhtrung5011@ds253468.mlab.com:53468/nodejs-news', { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error',() =>{
	console.log('connection error123');
});
db.once('open',() => {
	console.log('connected');
});




/************* session ************/
var app = express();

app.use(cookieParser());
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie:{
		maxAge:3*60*60*1000
	}
}));

require(__path.__path_configs+'passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
	next();
})


/************* validate ************/
app.use(validator({
	customValidators:{
		isNotEqual:(value1,value2) =>{
			return value1 !== value2;
		}
	}
}));

/************* notification ************/
app.use(flash());
app.use(function(req,res,next){
	res.locals.messages = req.flash();
	next();
});

/************* notification old ************/
// app.use(flash(app,{
// 	sessionName: 'item',
// 	utilityName: 'flash',
// 	localsName: 'flash',
// 	beforeSingleRender: function(notification, callback) {
// 		if (notification.type) {
// 		  switch(notification.type) {
// 			case 'error':
// 			  notification.alert_class = 'danger'
// 			break;
// 			case 'success':
// 			  notification.alert_class = 'success'
// 			break;
// 		  }
// 		}
// 		callback(null, notification)
// 	},
// 	afterAllRender: function(htmlFragments, callback) {
// 		// Naive JS is appened, waits a while expecting for the DOM to finish loading,
// 		// The timeout can be removed if jOuery is loaded before this is called, or if you're using vanilla js.
// 		htmlFragments.push([
// 		  `<script type="text/javascript">
// 				setTimeout(function(){
// 					$('.alert-dismissable .close').trigger('click');
// 				},6000);
// 		  </script>`
// 		].join(''))
// 		callback(null, htmlFragments.join(''))
// 	  },
// }));




/************* view engine setup  ************/

app.set(__path.__path_views+'views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');




// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname, 'public')));


/************* local variable ************/

app.locals.system = systemConfig;
app.locals.moment = moment;


/************* router ************/
app.use(`/${systemConfig.prefixConfigs}`, configsRouter);

var checkUserEmpty = async (req,res,next) => {
	UsersModel.countDocuments().then((items)=>{
		if(items>0){
			next();
		}else{
			res.redirect('/configs')
		}
	});
}
app.use(`(/${systemConfig.prefixBlog})?`,checkUserEmpty, indexRouter);
app.use(`/${systemConfig.prefixAdmin}`, indexAdminRouter);
app.use(`(/${systemConfig.prefixApi})?`, ApiRouter);

/************* catch 404 and forward to error handler  ************/

app.use(function(req, res, next) {
  next(createError(404));
});




/************* error handler ************/

app.use( async function(err, req, res, next) {
  // set locals, only providing error in development
//   res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};


  if(systemConfig.env == 'dev'){
		// render the error page
	res.status(err.status || 500);
	res.render(__path.__path_views+'error',{title :'error page'});
  }
  if(systemConfig.env == 'production'){
	let itemsCategorys =[];
	var folderView = __path.__path_views +'page/frontend/page/404';
	res.render(folderView, { 
		pageTitle:'404 page',
		top_posts:false,
		itemsCategorys
	});
  }
 
});




module.exports = app;
