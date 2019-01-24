var express = require('express');
var router = express.Router();

var linkIndex = '/contact';

var folderView = __path.__path_views +'page/frontend/form/sendmail';
var layoutview = __path.__path_views +'page/frontend/page/index';
const nodemailer = require("nodemailer");


router.get('/', async function(req, res, next) {
	res.render(folderView, { 
		pageTitle:'Contact',
	});
});


router.post('/sendmail', async function(req, res, next) {
	req.body = JSON.parse(JSON.stringify(req.body));
	let item = Object.assign(req.body);


	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
	service: 'gmail',
	  auth: {
		user: 'bdssaigon911@gmail.com', // generated ethereal user
		pass: 'psiwhffakkxykbeh' // generated ethereal password
	  }
	});
	  let mailOptions = {
		from: '"Fred Foo 👻" <foo@example.com>', // sender address
		to: item.email, // list of receivers
		subject:item.firstname, // Subject line
		text: item.subject, // plain text body
		html: item.lastname // html body
	  };

	 transporter.sendMail(mailOptions,function(error,info){
		if(error){
			return console.log(error);
		}
		console.log(info.response);
	  })
	
  // Preview only available when sending through an Ethereal account
	res.redirect(linkIndex);
});




module.exports = router;
