var express = require('express');
var router = express.Router();



/************* router ************/
var ApiPost = require('./api-post');




router.use('/v1/post',ApiPost);



module.exports = router;