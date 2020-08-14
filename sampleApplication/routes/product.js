var express = require('express');
var router = express.Router();

function adminonly(req, res, next){ 
	if (!req.session.isadmin)
	{		
		return res.redirect('customer/login');
	}
    next();
}

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3000/product
// ==================================================

router.get('/', adminonly, function(req, res, next) {
	
	let query = "SELECT product_id, productname, productimage, saleprice, status, homepage FROM product ";
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('product/allrecords', {allrecs: result });
	});
});


// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3000/product/1/show
// ==================================================
router.get('/:recordid/show', function(req, res, next) {
    let query = "SELECT product_id, productname, productimage, description, category_id, supplier_id, subcategory_1, subcategory_2, saleprice, status, homepage FROM product WHERE product_id= " + req.params.recordid; 

    // execute query
    db.query(query, (err, result) => {
        if (err) 
        {
            console.log(err);
            res.render('error');
        } 
        else 
        {
            res.render('product/onerec', {onerec: result[0] });
        } 
    });
});


// ==================================================
// Route to show empty form to obtain input form enduser.
// URL: http://localhost:3000/product/addrecord
// ==================================================
router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('product/addrec');
});



// =================================================
// Route to obtain user input and save in database.
// URL: http://localhost:3000/product/
// ==================================================
router.post('/', adminonly, function(req, res, next) {

    let insertquery = "INSERT INTO product(productname, productimage, description, category_id, supplier_id, subcategory_1, subcategory_2, saleprice, status, homepage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    var homepagechecked = false;
		if (req.body.homepage) {
			homepagechecked = true;
		} else {
			homepagechecked = false;
		}


    db.query(insertquery,[req.body.productname, req.body.productimage, req.body.description, req.body.category_id, req.body.supplier_id, req.body.subcategory_1, req.body.subcategory_2, req.body.saleprice, req.body.status, homepagechecked],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } 
        else {
            res.redirect('/product');
        }
    });
});

// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3000/product/1/edit
// ==================================================
router.get('/:recordid/edit', adminonly, function(req, res, next) {

	let query = "SELECT product_id , product_id, productname, productimage, description, category_id, supplier_id, subcategory_1, subcategory_2, saleprice, status, homepage FROM product WHERE product_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('product/editrec', {onerec: result[0] });
		}
	});
});

// ==================================================
// Route to save edited data in database.
// URL: http://localhost:3000/product/save
// ==================================================
router.post('/save', adminonly, function(req, res, next) {
    let updatequery = "UPDATE product SET productname= ?, productimage= ?, description = ?, category_id = ?, supplier_id = ?, subcategory_1 = ?, subcategory_2 = ?, saleprice = ?, status = ?, homepage = ? WHERE product_id = " + req.body.product_id; 

    var homepagechecked = false;
		if (req.body.homepage) {
			homepagechecked = true;
		} else {
			homepagechecked = false;
		}

    db.query(updatequery,[req.body.productname, req.body.productimage, req.body.description, req.body.category_id, req.body.supplier_id, req.body.subcategory_1, req.body.subcategory_2, req.body.saleprice, req.body.status, homepagechecked],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } 
        else {
            res.redirect('/product');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// URL: http://localhost:3000/product/1/delete
// ==================================================
router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM product WHERE product_id = " + req.params.recordid; 
    // execute query

    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/product');
        } 
    });
});


module.exports = router;



