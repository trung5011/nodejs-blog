var express      = require('express');
var router       = express.Router();




var ArticleItemModel   = require(__path.__path_models+'article');
var DomainModel   = require(__path.__path_models+'domain');



router.get('/list', function(req, res, next) {
    ArticleItemModel.getItemApi().then((items) => {
		res.json({
			data: items
		});
    });
});



router.get('/list/:id', function(req, res, next) {
	ArticleItemModel.getItemApi({_id:req.params.id}).then((items) => {
		res.json({
			data: items
		});
    });
});


// router.get('/domain', function(req, res, next) {
//     // ArticleItemModel.getItemApi().then((items) => {
// 	// 	res.json({
// 	// 		data: items
// 	// 	});
// 	// });
// 	DomainModel.getAllItem().then((results)=>{
// 		console.log(results);
// 	});
// });

router.get('/domain/:domain', function(req, res, next) {
	ArticleItemModel.getItemApiDomain(req.params.domain).then((items) => {
		res.json({
			data: items
		});
    });
});


module.exports = router;