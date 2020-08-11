var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

	let query = "SELECT product_id, productname, productimage, saleprice, status, homepage FROM product WHERE homepage = 1";
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('index', {allrecs: result });
	});

});

module.exports = router;
