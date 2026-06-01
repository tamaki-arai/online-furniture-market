/*
* Name: Hank O'Brien
* Date: Something XX, 2024
* Section: CSE 154 AD
*
* This is the server side code for our project. It stores the data that we send it
* and creates responses accordingly.
*/

"use strict";
const express = require('express');
const multer = require("multer");
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');
const app = express();
app.use(multer().none());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

(function() {
  // The ID of the user who is currently signed in.
  let loggedIn = -1;

  // Called when you navigate to a user's page. Returns their personal information.
  app.get('/user', async (req, res) => {
    try {
      let db = await getDBConnection();
      let qry = 'SELECT id, name, username, email, password, DOB, points, rank, purchases, cart \
      FROM users WHERE id = ?;';
      let info = await db.get(qry, [loggedIn]);
      if (!info) {
        throw new error('No user ');
      }
      res.type('json');
      res.json(info);
      return await db.close();
    } catch (error) {
      if (error.toString().slice(0, error.toString().indexOf('\n')) === 'Error: No user') {
        res.type('text');
        res.status(400).send('User does not exist.');
      } else {
        res.type('text');
        res.status(500).send('An error occurred on the server. Try again later.');
      }
    }
  });

  // If no parameter gets all items in stock and returns their data that is displayed.
  // In progress: If there are query parameters, we want to return a list of ids that match the
  // parameters, so we can hide the items the items that don't. This will be quite complicated
  // compared to yipper, due to having multiple search terms and filters to deal with.
  app.get('/items', async (req, res) => {
    if (req.query.search === undefined) {
      try {
        let db = await getDBConnection();
        let qry = 'SELECT id, name, description, price, stocks, categories, colors, materialTypes, \
        materials, width, depth, height, mainImage, reviews, rating, reviewCount, sales, \
        date, brand, featured FROM items ORDER BY sales DESC;';
        let rows = await db.all(qry);
        await db.close();
        let responseObject = {"items": rows};
        res.type('json');
        return res.json(responseObject);
      } catch (error) {
        res.type('text');
        res.status(500).send('An error occurred on the server. Try again later.');
      }
    } else {
      try {
        let db = await getDBConnection();
        let terms = JSON.parse(req.query.search);
        let formattedTerms = new Array(terms.length*2);
        let qry = 'SELECT id, name, description, price, stocks, categories, colors, materialTypes, \
        materials, width, depth, height, mainImage, reviews, rating, reviewCount, sales, \
        date, brand, featured FROM items WHERE';
        terms.forEach((element, index) => {
          qry += ' name LIKE ? OR brand LIKE ?'
          formattedTerms[index*2] = '%' + element + '%';
          formattedTerms[index*2 + 1] = '%' + element + '%'
          if (index < terms.length - 1) {qry += ' AND'}
        });
        qry += ' ORDER BY sales DESC;';
        let rows = await db.all(qry, formattedTerms);
        await db.close();
        let responseObject = {"items": rows};
        res.type('json');
        return res.json(responseObject);
      } catch (error) {
        console.log(error);
      }
    }
  });

    // UNFINISHED
    // Waiting for Tamaki to update the filter menu so we can have ideal inputs.
    // This function involves selecting the ids of all of the items that meet the filter criteria
    // so we can know which ones to hide in our front end. However, the filter is very complicated,
    // with a lot of different options available so figuring out how to select the ids that we want
    // will take a bit to figure out.
  app.get('/filter', async (req, res) => {
    try{
      let db = await getDBConnection();
    let qry = 'SELECT id FROM items WHERE ';

    if (req.query.logic === 'OR') {
      JSON.parse(req.query.categories).forEach (element => {
        qry += 'category LIKE ? OR ';
      });
      JSON.parse(req.query.colors).forEach (element => {
        qry += 'color LIKE ? OR ';
      });

      JSON.parse(req.query.brands).forEach (element => {
        qry += 'brand LIKE ? OR ';
      });

      if (req.query.star !== undefined){
        qry += 'rating >= ?';
      }
    } else if (req.query.logic === 'AND') {
      JSON.parse(req.query.categories).forEach (element => {
        qry += 'category LIKE ? AND ';
      });
      JSON.parse(req.query.colors).forEach (element => {
        qry += 'color LIKE ? AND ';
      });

      JSON.parse(req.query.brands).forEach (element => {
        qry += 'brand LIKE ? AND ';
      });

      if (req.query.star !== undefined){
        qry += 'rating >= ?';
      }
    }
    let params = concat(req.query.categories, req.query.colors, req.query.brands);
    params.forEach(element => {
      element = '%' + element + '%';
    })
    if(req.query.rating !== undefined) {params.push(req.query.rating)}
    console.log(params);
    let result = await db.all(qry, params);
    res.type('JSON');
    res.json(result);
    await db.close();
    } catch (error) {

    }

  })

  // UNFINISHED
  // Still figuring out how exactly I should implement this. I'm thinking that it should contain
  // all of the needed data for the cart objects.
  app.get('/getCart', async (req, res) => {
    try {
      let db = await getDBConnection();
      let qry = 'SELECT cart FROM users WHERE id = ?;';
      let cart = await db.get(qry, [loggedIn]);
    } catch (error) {

    }
  })

  // UNFINISHED
  app.get('/product/:id', async (req, res) => {
    try {
      let db = await getDBConnection();
      let qry = 'SELECT id, name, price, stocks, featured, date, reviews, \
        categories, colors, materials, dimensions, stars, mainimage, FROM items WHERE id = ?;';
      let info = await db.get(qry);
      await db.close;
      res.type('json');
      return res.json(info);
    } catch (error) {

    }
  });

  app.get('/checklogin', (req, res) => {
    res.type('text');
    res.send('' + loggedIn);
  })

  // Adds an item to the cart property in the users database. Returns the new cart.
  // The cart is an array of obects of the form {itemId: ?, quantity: ?}
  app.post('/addtocart', async (req, res) => {
    try {
      let db = await getDBConnection();
      let getQry = 'SELECT cart FROM users WHERE id = ?;';
      let oldCart = await db.get(getQry, [loggedIn]);
      let cartArray = JSON.parse(oldCart);
      let itemContained = false;
      cartArray.forEach((element) => {
        if (element.itemId === req.body.id){
          element.quantity += req.body.quantity; //req.body.quantity might always be 1 depending on implementation
          itemContained = true;
        }
      });
      if (!itemContained) {
        cartArray.push({itemId: req.body.id, quantity: req.body.quantity});
      }
      let updateQry = "UPDATE users SET cart = ? WHERE id = ?;";
      await db.run(updateQry, [JSON.stringify(cartArray), loggedIn]);
      res.type('json');
      res.json(cartArray);
    } catch (error) {

    }
  });

  // Removes a number of items from the cart property in the users database. Will finish soon
  app.post('removefromcart', async (req, res) => {
    try {
      let db = await getDBConnection();
      let getQry = 'SELECT cart FROM users WHERE id = ?;';
      let oldCart = await db.get(getQry, [loggedIn]);
      let cartArray = JSON.parse(oldCart);
      cartArray.forEach((element, index) => {
        if (element.itemId === req.body.id && element.quantity > req.body.quantity) {
          element.quantity -= req.body.quantity; //req.body.quantity might always be 1 depending on implementation
        } else if (element.itemId === req.body.id && element.quantity <= req.body.quantity) {
          cartArray.splice(index, 1);
        }
      });
      let updateQry = "UPDATE users SET cart = ? WHERE id = ?;";
      await db.run(updateQry, [JSON.stringify(cartArray), loggedIn]);
      res.type('json');
      res.json(cartArray);
    } catch (error) {

    }
  });

    // Sets the quantity of an item manualy
    app.post('setquantitycart', async (req, res) => {
      try {
        let db = await getDBConnection();
        let getQry = 'SELECT cart FROM users WHERE id = ?;';
        let oldCart = await db.get(getQry, [loggedIn]);
        let cartArray = JSON.parse(oldCart);
        cartArray.forEach((element, index) => {
          if (element.itemId === req.body.id &&  req.body.quantity > 0) {
            element.quantity = req.body.quantity; //req.body.quantity might always be 1 depending on implementation
          } else if (element.itemId === req.body.id && req.body.quantity === 0) {
            cartArray.splice(index, 1);
          }
        });
        let updateQry = "UPDATE users SET cart = ? WHERE id = ?;";
        await db.run(updateQry, [JSON.stringify(cartArray), loggedIn]);
        res.type('json');
        res.json(cartArray);
      } catch (error) {

      }
    });

  // UNFINISHED
  // Adds a rating to an item and adds the user to a list of people who have already rated it.
  // Will do nothing if the user has already rated it.
  // Reviews is an array that consists of objects with the form {rating: ?, content: ?, userId: ?}
  app.post('/reviewItem', async (req, res) => {
    try {
      let db = await getDBConnection();
      let getQry = 'SELECT reviews FROM items WHERE id = ?;';
      let oldReviews = await db.get(getQry, [req.body.itemId]);
      let reviewArray = JSON.parse(oldReviews);
      let hasReviewed = false;
      reviewArray.forEach((element) => {
        if (element.userId === loggedIn) {
          element = {rating: req.body.rating, content: req.body.content, userId: loggedIn};
          itemContained = true;
        }
      });
      if (!hasReviewed) {
        reviewArray.push({rating: req.body.rating, content: req.body.content, userId: loggedIn});
      }
      let updateQry = "UPDATE items SET reviews = ? WHERE id = ?;";
      await db.run(updateQry, [JSON.stringify(reviewArray), req.body.itemId]);
      res.type('json');
      res.json(reviewArray);
    } catch (error) {

    }
  });

  // UNFINISHED
  // Buys an item, updates its stocks to reflect that and adds the item to the user's purchase
  // history. Purchases is an array whose elements have the form
  // {date: ?, confirmNum: ?, total: ?, pointsEarned: ?, items: [{itemId: ?, quantity: ?},...]}
  // This is going to be a bit complicated. I will need some time to think about this.
  app.post('/buyItems', async (req, res) => {
    try {
      if (!req.query.itemId || !req.query.userId) {
        throw new error('No ID ');
      }
      let db = await getDBConnection();
      let itemCheckQry = 'SELECT stocks from items WHERE id = ?;';
      let verify = await db.get(itemCheckQry, [req.query.itemId]);
      if (!verify) {
        throw new error('No item ');
      } else if (verify <= 0) {
        throw new error('No stocks ');
      }
      let updateQry = 'UPDATE items SET stocks = stocks - 1 WHERE id = ?;';
      await db.run(updateQry);
      let purchaseQry = 'SELECT purchases from users WHERE id = ?;';
      let result = await db.run(purchaseQry, [req.query.userId]);
      if (!result) {
        throw new error('No user ');
      }
      let purchases = JSON.parse(result);
      purchases.push(req.query.id);
      let updatePurchaseQry = 'UPDATE users SET purchases = ? WHERE id = ?;';
      await db.run(updatePurchaseQry,[JSON.stringify(purchases), req.query.userID]);
      await db.close();

    } catch (error){
      if (error.toString().slice(0, error.toString().indexOf('\n')) === 'Error: No item') {
        res.type('text');
        res.status(400).send('Item does not exist.');
      } else if (error.toString().slice(0, error.toString().indexOf('\n')) === 'Error: No stocks'){
        res.type('text');
        res.status(400).send('Item is out of stock.');
      } else if (error.toString().slice(0, error.toString().indexOf('\n')) === 'Error: No ID'){
        res.type('text');
        res.status(400).send('Missing one or more required perams.');
      } else if (error.toString().slice(0, error.toString().indexOf('\n')) === 'Error: No user'){
        res.type('text');
        res.status(400).send('User does not exist.');
      } else {
        res.type('text');
        res.status(500).send('An error occured in the server, please try later.');
      }
    }
  });

  app.post('/login', async (req, res) => {
    try {
    let db = await getDBConnection();
    let qry = 'SELECT password, id FROM users WHERE username = ?;';
    let verifier = await db.get(qry, [req.body.username]);
    res.type('text');
    if (!verifier || verifier.password !== req.body.password){
      res.send('Login Failed');
    } else {
      loggedIn = verifier.id;
      res.send('Login successful!');
    }
    await db.close();
    } catch (error) {

    }
  });

  app.get('/logout', (req, res) => {
    try {
      loggedIn = -1;
      if (loggedIn === -1){
        res.type('text');
        res.send('Success!');
      }
    } catch (error) {

    }
    loggedIn = -1;
  });

  // Adds a user to our database.
  app.post('/adduser', async (req, res) => {
    try {
      if (!req.body.name || !req.body.user || !req.body.email || !req.body.pass || !req.body.img) {
        throw new error('Missing params ');
      }
      let db = await getDBConnection();
      let qry = 'INSERT INTO users \
      ("name", "username", "email", "password", "profile") \
      VALUES (?, ?, ?, ?, ?);';
      let result = await db.run(
        qry,
        [req.body.name,
          req.body.user,
          req.body.email,
          req.body.pass,
          req.body.img
        ]);
      await db.close();
      loggedIn = result.lastID;
      res.type('text');
      return res.send('' + result.changes);
    } catch (error) {
      if (error.toString().slice(0, error.toString().indexOf('\n')) === 'Error: Missing params') {
        res.type('text');
        res.status(400).send('Missing one or more reqired params');
      } else {
        res.type('text');
        res.status(500).send('An error occured in the server, please try later.');
      }
    }
  });

  async function checkExistence(db, table, column, value) {
    let itemCheckQry = 'SELECT ' + column + ' from ' + table + ' WHERE '+ column + ' = ?;';
    let verify = await db.run(itemCheckQry, [value]);
    return verify !== undefined;
  }

  /**
   * Establishes a database connection to the database and returns the database object.
   * Any errors that occur should be caught in the function that calls this one.
   * @returns {sqlite3.Database} - The database object for the connection.
   */
  async function getDBConnection() {
    const db = await sqlite.open({
      filename: 'online-furniture-market.db', // replace this with your db file name
      driver: sqlite3.Database
    });

    return db;
  }
})();

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);