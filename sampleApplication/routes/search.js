var express = require('express');
var router = express.Router();

// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3000/search
// ==================================================
router.get('/', function(req, res, next) {

	let query = "SELECT product_id, productname, productimage, category_id, supplier_id FROM product WHERE description LIKE '%" + req.query.searchcriteria + "%'";   

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('search', {products: result});
		} 
	});
});

module.exports = router;
