var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3000/supplier
// ==================================================

router.get('/', function(req, res, next) {
	
	let query = "SELECT supplier_id , companyname, pointofcontact , website, phone FROM supplier";
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('supplier/allrecords', {allrecs: result });
	});
});


// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3000/supplier/1/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT supplier_id , companyname, pointofcontact , website, phone FROM supplier WHERE supplier_id= " + req.params.recordid; 

    // execute query
    db.query(query, (err, result) => {
        if (err) 
        {
            console.log(err);
            res.render('error');
        } 
        else 
        {
            res.render('supplier/onerec', {onerec: result[0] });
        } 
    });
});


// ==================================================
// Route to show empty form to obtain input form enduser.
// URL: http://localhost:3000/supplier/addrecord
// ==================================================
router.get('/addrecord', function(req, res, next) {
	res.render('supplier/addrec');
});


// =================================================
// Route to obtain user input and save in database.
// URL: http://localhost:3000/supplier/
// ==================================================
router.post('/', function(req, res, next) {

    let insertquery = "INSERT INTO supplier(companyname, pointofcontact , website, phone) VALUES (?, ?, ?, ?)";

    db.query(insertquery,[req.body.companyname, req.body.pointofcontact, req.body.website, req.body.phone],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } 
        else {
            res.redirect('/supplier');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3000/supplier/1/edit
// ==================================================
router.get('/:recordid/edit', function(req, res, next) {

	let query = "SELECT supplier_id , companyname, pointofcontact , website, phone FROM supplier WHERE supplier_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('supplier/editrec', {onerec: result[0] });
		}
	});
});

// ==================================================
// Route to save edited data in database.
// URL: http://localhost:3000/supplier/save
// ==================================================
router.post('/save', function(req, res, next) {
    let updatequery = "UPDATE supplier SET companyname= ?, pointofcontact= ?, website = ?, phone = ? WHERE supplier_id = " + req.body.supplier_id; 

    db.query(updatequery,[req.body.companyname, req.body.pointofcontact, req.body.website, req.body.phone],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } 
        else {
            res.redirect('/supplier');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// URL: http://localhost:3000/supplier/1/delete
// ==================================================
router.get('/:recordid/delete', function(req, res, next) {
    let query = "DELETE FROM supplier WHERE supplier_id = " + req.params.recordid; 
    // execute query

    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/supplier');
        } 
    });
});


module.exports = router;



