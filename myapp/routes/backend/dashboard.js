var express = require('express');
var router = express.Router();


/* GET Dashpage page. */
router.get('/', function(req, res, next) {
  res.render('page/backend/dashboard', { title: 'Dashpage page' });
});



module.exports = router;
