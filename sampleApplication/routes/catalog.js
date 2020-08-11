var express = require('express');
var router = express.Router();

// ==================================================
// Route to list all products on the catalog
// ==================================================
router.get('/', function(req, res, next) {
  let query = "SELECT product_id, productname, productimage, status, description, saleprice from product"; 

  // execute query
  db.query(query, (err, result) => {
		if (err) {
			res.render('error');
			}
	res.render('catalog/catalog', {products: result });
 	});
});


// ==================================================
// Route to add an item to the cart
// ==================================================
router.post('/add', function(req, res, next) {
	if (typeof req.session.cart !== 'undefined' && req.session.cart ) {			// if the cart exists
		if (req.session.cart.includes(req.body.product_id))						// if the cart array has the product
			{
				// Item Exists in Basket - Increase Quantity 
				var n = req.session.cart.indexOf(req.body.product_id);
				req.session.qty[n] = parseInt(req.session.qty[n]) + parseInt(req.body.qty);
			}
		else
			{
				// Item Being Added First Time
				req.session.cart.push(req.body.product_id);		
				req.session.qty.push(req.body.qty);
			}
	}else {
		var cart = [];							// local array
		cart.push(req.body.product_id);			// refersto the hidden field 
		req.session.cart = cart;				// creating a session variable for the first time
		
		var qty = [];							
		qty.push(req.body.qty);
		req.session.qty = qty;
	}
  res.redirect('/catalog/cart');
});


// ==================================================
// Route to remove an item from the cart
// ==================================================
router.post('/remove', function(req, res, next) {
  	// Find the element index of the product_id that needs to be removed
	var n = req.session.cart.indexOf(req.body.product_id);
	
	// Remove element from cart and quantity arrays
	req.session.cart.splice(n,1);
	req.session.qty.splice(n,1);

   	res.redirect('/catalog/cart');

});


// ==================================================
// Route to show shopping cart
// URL: http://localhost:3000/catalog/cart
// ==================================================
router.get('/cart', function(req, res, next) {
	if (!Array.isArray(req.session.cart) || !req.session.cart.length){
		res.render('catalog/cart', {cartitems: 0 });
	} else {	
		let query = "SELECT product_id, productname, productimage, description, saleprice, status FROM product WHERE product_id IN (" + req.session.cart + ")";

		// execute query
		db.query(query, (err, result) => {
			if (err) {res.render('error');} else  
					{res.render('catalog/cart', {cartitems: result, qtys: req.session.qty  });}
		});
	}
});


// ==================================================
// Route save cart items to SALEORDER and ORDERDETAILS tables
// URL: http://localhost:3000/catalog/checkout
// ==================================================
router.get('/checkout', function(req, res, next) {
	
	// Check to make sure the customer has logged-in
	if (typeof req.session.customer_id !== 'undefined' && req.session.customer_id ) {
		// Save SALEORDER Record:
		let insertquery = "INSERT INTO saleorder(customer_id, saledate, customernotes, paymentstatus) VALUES (?, now(), 'None', 'Paid')"; 
		db.query(insertquery,[req.session.customer_id],(err, result) => {
			if (err) {
				console.log(err);
				res.render('error');
			} else {
				// Obtain the order_id value of the newly created SALEORDER Record
				var order_id = result.insertId;
				// Save ORDERDETAIL Records
				// There could be one or more items in the shopping cart
				req.session.cart.forEach((cartitem, index) => { 
					// Perform ORDERDETAIL table insert
					let insertquery = "INSERT INTO orderdetail(order_id, product_id, saleprice, qty) VALUES (?, ?, (SELECT saleprice from product where product_id = " + cartitem + "), ?)";
					db.query(insertquery,[order_id, cartitem, req.session.qty[index]],(err, result) => {
						if (err) {res.render('error');}
					});
				});
				// Empty out the items from the cart and quantity arrays
				req.session.cart = [];
				req.session.qty = [];
				// Display confirmation page
				res.render('catalog/checkout', {ordernum: order_id });
				}		
			});
	}
	else {
		// Prompt customer to login
		res.redirect('/customer/login');
	}
})


module.exports = router;
