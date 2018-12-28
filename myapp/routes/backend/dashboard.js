var express = require('express');
var router = express.Router();

var folderView = __path.__path_views+'page/backend/dashboard' ;

/* GET Dashpage page. */
router.get('/', function(req, res, next) {
	console.log('fdsfsdf')
  res.render(folderView, { title: 'Dashpage page' });
});



module.exports = router;
