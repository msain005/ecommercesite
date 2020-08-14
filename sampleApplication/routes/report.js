var express = require('express');
var router = express.Router();

/* GET reports menu. 
   URL: http://localhost:3000/report */
router.get('/', function(req, res, next) {
	res.render('report/repmenu');
	
});

/* Customer listing report 
   URL: http://localhost:3000/report/custlist */
router.get('/custlist', function(req, res, next) {

	let query = "SELECT firstname, lastname, city, state FROM customer";
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('report/custlist', {allrecs: result });
	});

});

module.exports = router;
