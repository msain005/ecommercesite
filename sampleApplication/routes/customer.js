var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

function adminonly(req, res, next){ 
	if (!req.session.isadmin)
	{		
		return res.redirect('customer/login');
	}
    next();
}


// ==================================================
// Route Enable Registration
// URL: http://localhost:3000/customer/register
// ==================================================
router.get('/register', function(req, res, next) {
	res.render('customer/addrec');
});


// ==================================================
// Route Provide Login Window
// URL: http://localhost:3000/customer/login
// ==================================================
router.get('/login', function(req, res, next) {
	res.render('customer/login', {message: "Please Login"});
});


// ==================================================
// Route Check Login Credentials
// ==================================================
router.post('/login', function(req, res, next) {
	
  let query = "select customer_id, firstname, lastname, password, isadmin from customer WHERE username = '" + req.body.username + "'"; 
  // execute query
  db.query(query, (err, result) => {
		if (err) {res.render('error');} 
		else {
			if(result[0])
				{
				// Username was correct. Check if password is correct
				bcrypt.compare(req.body.password, result[0].password, function(err, result1) {
					if(result1) {		// if password matches
						// Password is correct. Set session variables for user.
						var custid = result[0].customer_id;				// customer id value 
						req.session.customer_id = custid;				// assign customer id to session variable
						var custname = result[0].firstname + " "+ result[0].lastname;	// customer first and last name
						req.session.custname = custname;				// for welcome message used in header.ejs
						
						if(result[0].isadmin) 
						{
							req.session.isadmin = true
						}
						else
						{
							req.session.isadmin = false;
						}
							
						res.redirect('/');
					} else {
						// password do not match
						res.render('customer/login', {message: "Wrong Password"});
					}
				});
				}
			else {res.render('customer/login', {message: "Wrong Username"});}
		} 
 	});
});

// ==================================================
// Route to logout
// ==================================================
router.get('/logout', function(req, res, next) {
	req.session.customer_id = 0;
	req.session.custname = "";
	req.session.isadmin = 0;
	res.redirect('/');
});

// ==================================================
// Route to list all records. Display view to list all records
// URL: http://localhost:3000/customer
// ==================================================

router.get('/', adminonly, function(req, res, next) {
	
	let query = "SELECT customer_id , firstname , lastname , city, state, isadmin FROM customer ";
	
	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		}
	res.render('customer/allrecords', {allrecs: result });
	});
});


// ==================================================
// Route to view one specific record. Notice the view is one record
// URL: http://localhost:3000/customer/1/show
// ==================================================
router.get('/:recordid/show', adminonly, function(req, res, next) {
    let query = "SELECT customer_id, firstname, lastname, email, phone, address1, address2, city, state, zip, addlnotes, username, password, isadmin FROM customer WHERE customer_id= " + req.params.recordid; 

    // execute query
    db.query(query, (err, result) => {
        if (err) 
        {
            console.log(err);
            res.render('error');
        } 
        else 
        {
            res.render('customer/onerec', {onerec: result[0] });
        } 
    });
});


// ==================================================
// Route to show empty form to obtain input form enduser.
// URL: http://localhost:3000/customer/addrecord
// ==================================================
router.get('/addrecord', adminonly, function(req, res, next) {
	res.render('customer/addrec');
});


// =================================================
// Route to obtain user input and save in database.
// URL: http://localhost:3000/customer/
// ==================================================

router.post('/', function(req, res, next) {
	let insertquery = "INSERT INTO customer (firstname, lastname, email, phone, address1, address2, city, state, zip, addlnotes, username, password, isadmin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 

    var isadminchecked = false;
		if (req.body.isadmin) {
			isadminchecked = true;
		} else {
			isadminchecked = false;
		}

	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if(err) { res.render('error');}
				db.query(insertquery,[req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zip, req.body.addlnotes, req.body.username, hash, isadminchecked],(err, result) => {
					if (err) {console.log(err);res.render('error');} 
					else {res.redirect('/');}
				});
		});
	});
});


// ==================================================
// Route to edit one specific record.
// URL: http://localhost:3000/customer/1/edit
// ==================================================
router.get('/:recordid/edit', adminonly, function(req, res, next) {

	let query = "SELECT customer_id , firstname , lastname , email, phone, address1, address2, city, state, zip, addlnotes , username, password, isadmin FROM customer WHERE customer_id = " + req.params.recordid;

	// execute query
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.render('error');
		} else {
			res.render('customer/editrec', {onerec: result[0] });
		}
	});
});

// ==================================================
// Route to save edited data in database.
// URL: http://localhost:3000/customer/save
// ==================================================
router.post('/save', adminonly, function(req, res, next) {
    let updatequery = "UPDATE customer SET firstname= ?, lastname= ?, email = ?, phone = ?, address1 = ?, address2 = ?, city = ?, state = ?, zip = ?, addlnotes= ?, username = ?, password = ?, isadmin = ? WHERE customer_id = " + req.body.customer_id; 

    var isadminchecked = false;
		if (req.body.isadmin) {
			isadminchecked = true;
		} else {
			isadminchecked = false;
		}

    db.query(updatequery,[req.body.firstname, req.body.lastname, req.body.email, req.body.phone, req.body.address1, req.body.address2, req.body.city, req.body.state, req.body.zip, req.body.addlnotes, req.body.username, req.body.password, isadminchecked],(err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } 
        else {
            res.redirect('/customer');
        }
    });
});

// ==================================================
// Route to delete one specific record.
// URL: http://localhost:3000/customer/1/delete
// ==================================================
router.get('/:recordid/delete', adminonly, function(req, res, next) {
    let query = "DELETE FROM customer WHERE customer_id = " + req.params.recordid; 
    // execute query

    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.render('error');
        } else {
            res.redirect('/customer');
        } 
    });
});


module.exports = router;



