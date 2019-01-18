var express      = require('express');
var router       = express.Router();




var ArticleItemModel   = require(__path.__path_models+'article');



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



module.exports = router;