var express = require('express');
var router = express.Router();

// ##################################
// #URL: http://localhost:3000/contact#
// ##################################
router.get('/', function(req, res, next) 
{
	res.render('contact');	// displaying the contents of the about view
});

module.exports = router;	// make application recognize handler