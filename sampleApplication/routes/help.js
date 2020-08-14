var express = require('express');
var router = express.Router();

// ##################################
// #URL: http://localhost:3000/help#
// ##################################
router.get('/', function(req, res, next) 
{
	res.render('help');	// displaying the contents of the help view
});

module.exports = router;	// make application recognize handler