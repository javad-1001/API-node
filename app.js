const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

var cors = require('cors')

const app = express();

const PORT = 3000;

app.use(bodyParser.json());


app.use(cors())




var mysql = require('mysql2');
const e = require('express');


var connection = mysql.createConnection({
  host: 'services.irn8.chabokan.net',
  user: 'behdood232_jennifer',
  password: 'G8923pYMfFkh',
  database: 'behdood232_jennifer',
  port: 2763,  
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// login for admin
app.post('/login', (req, res) => {
  const { strUsername, strPassword } = req.body;
  const query = `SELECT * FROM user_admin WHERE strUsername = ? AND strPassword = ?`;
  connection.query(query, [strUsername, strPassword], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      // Generate a JWT token
      const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).json({
        result: true,
        message: 'Login successful',
        id: user.id,
        strToken: token, // Send the generated token
        strMobile: user.strMobile,
        strName: user.strName,
        strFamily: user.strFamily,
        
      });
    } else {
      res.status(401).json({ result: false, error: 'Invalid credentials' });
    }
  });
});

// get all products
app.get('/getAllProducts', (req, res) => {
  const query = 'SELECT * FROM products';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});

// get all category
app.get('/getAllCategories', (req, res) => {
  const query = 'SELECT * FROM categories';
  connection.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json(results);
  });
});

// add product for admin 
app.post('/addProduct', (req, res) => {
  var product  = {
    strTitle: req.body.strTitle,
    strDetail: req.body.strDetail,
    fWeight: req.body.fWeight,
    fHeight: req.body.fHeight,
    iPrice: req.body.iPrice,
    strImage: req.body.strImage,
    strSummery: req.body.strSummery,
    iCode: req.body.iCode,
    bActive: req.body.bActive,
    iCategory: req.body.iCategory
    };
  var query = "INSERT INTO `products` SET ?"
  connection.query(query,product, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(401).json({ result: false, error: 'Invalid credentials' });
    } else {
      res.status(200).json({
        result: true,
        message: 'added successful',
      });
    }
  });
});

// delete product
app.post('/deleteProduct', (req, res) => {
  var product  = {
    iProduct: req.body.iProduct
    };
  var query = "DELETE FROM products WHERE products.?"
  connection.query(query,product, (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to delete a new row with default values');
    } else {
      res.status(200).send('Row with default values deleted successfully');
    }
  });
});

// edit product
app.put('/editProduct/:iProduct', (req, res) => {
  const iProduct = req.params.iProduct;

  const updatedProduct = {
    strTitle: req.body.strTitle,
    strDetail: req.body.strDetail,
    fWeight: req.body.fWeight,
    fHeight: req.body.fHeight,
    iPrice: req.body.iPrice,
    strImage: req.body.strImage,
    strSummery: req.body.strSummery,
    iCode: req.body.iCode,
    bActive: req.body.bActive,  
    iCategory: req.body.iCategory
  };

  const query = "UPDATE products SET ? WHERE iProduct = ?";
  connection.query(query, [updatedProduct, iProduct], (error, results, fields) => {
    if (error) {
      console.error(error);
      res.status(500).send('Failed to update the product');
    } else {
      res.status(200).send('Product updated successfully');
    }
  });
});


// app.post('/login', (req, res) => {
//   const { strUsername, strPassword } = req.body;
//   const query = `SELECT * FROM user_admin WHERE strUsername = ? AND strPassword = ?`;
//   connection.query(query, [strUsername, strPassword], (error, results) => {
//     if (error) {
//       res.status(500).json({ error: 'Database error' });
//       return;
//     }
//     if (results.length > 0) {
//       const user = results[0];
//       res.status(200).json({
//          result: true,
//           message: 'Login successful', 
//           id: user.id ,
//           strToken: user.strToken,
//           strMobile: user.strMobile,
//           strName: user.strName,
//           strFamily: user.strFamily,
//         });
//     } else {
//       res.status(401).json({ result: false, error: 'Invalid credentials' });
//     }
//   });
// });

// app.post('/addProduct', (req, res) => {
//   const {  iSellerId, strToken, strMobile, strMobileSchema, iPrice, strPreNumber, bActive, tiOperator, tiStatus, tiType, tiCondition } = req.body;
//   const query = `SELECT * FROM user_admin WHERE iSellerId = ? AND strToken = ?`;
//   connection.query(query, [iSellerId, strToken], (error, results) => {
//     if (error) {
//       res.status(500).json({ error: 'Database error' });
//       return;
//     }
//     if (results.length > 0) {
//       res.status(200).json({
//          result: true,
//           message: 'auth successful', 
//         });
//     } else {
//       res.status(401).json({ result: false, error: 'Invalid credentials' });
//     }
//   });
// });

// app.post('/addUser', (req, res) => {
//   var user  = {
//     strMobile: req.body.strMobile,
//     strName: req.body.strName,
//     strUsername: req.body.strUsername,
//     strPassword: req.body.strPassword,
//     strFamily: req.body.strFamily,
//     };
//   var query = "INSERT INTO `user_admin` SET ?"
//   connection.query(query,user, (error, results, fields) => {
//     if (error) {
//       res.status(500).send('Failed to add a new row with default values');
//     } else {
//       res.status(200).json({
//         result: true,
//          message: 'sign up successful', 
//          id: user.id ,
//          strToken: user.strToken,
//          strMobile: user.strMobile,
//          strName: user.strName,
//          strFamily: user.strFamily,
//        });    }
//   });
// });


// app.post('/addDefaultRow', (req, res) => {
//   const query = `INSERT INTO products (iProduct, strTitle, sreDetail, strImage, fWeight, fHeight, iPrice, strSummery, iCode, bActive, iCategory) VALUES (NULL, 'test', 'test', 'test', 3.2, 3333, 44, 'test', 1, 1, 5)`;

//   connection.query(query, (error, results, fields) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('Failed to add a new row with default values');
//     } else {
//       res.status(200).send('Row with default values added successfully');
//     }
//   });
// });

// app.post('/api/addUser',
//   (req, res) => {
//     const { strPassword, iMobileNumber, strName, strFamily, iRole, bActive } = req.body;

//     const insertQuery = `INSERT INTO users (strPassword, iMobileNumber, strName, strFamily, iRole, bActive) VALUES (?, ?, ?, ?, ?, ?)`;
//     const values = [strPassword, iMobileNumber, strName, strFamily, iRole, bActive];

//     connection.query(insertQuery, values, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send('Failed to insert user');
//       }

//       res.status(201).send('User inserted successfully');
//     });

//   });



// app.delete('/api/users_Delete/:id', (req, res) => {
//   const { id } = req.params;
//   const DELETE_QUERY = `DELETE FROM users WHERE id = ${id}`;

//   db.query(DELETE_QUERY, (err, result) => {
//     if (err) {
//       res.status(500).send(err.message);
//     } else {
//       res.send(`Deleted ${result.affectedRows} row(s)`);
//     }
//   });
// });





app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));