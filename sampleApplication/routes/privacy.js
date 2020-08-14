var express = require('express');
var router = express.Router();

// ##################################
// #URL: http://localhost:3000/privacy#
// ##################################
router.get('/', function(req, res, next) 
{
	res.render('privacy');	// displaying the contents of the privacy view
});

module.exports = router;	// make application recognize handler