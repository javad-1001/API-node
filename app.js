const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

const app = express();

const PORT = 5000;

app.use(bodyParser.json());


app.use(cors())


// query for add user
//INSERT INTO `users` (`id`, `username`, `password`, `phone`) VALUES (NULL, 'javad', '1234', '09123456789'); 



var mysql = require('mysql');
const e = require('express');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'javad',
  password: 'javad',
  database: 'behdood_db'
});

connection.connect(function (err) {
  // connected! (unless `err` is set)
});


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

app.post('/login_admin', (req, res) => {
  const { strUsername, strPassword } = req.body;

  const query = `SELECT * FROM user_admin WHERE strUsername = ? AND strPassword = ?`;

  connection.query(query, [strUsername, strPassword], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Database error' });
      return;
    }

    if (results.length > 0) {
      res.status(200).json({ result: true, message: 'Login successful' });
    } else {
      res.status(401).json({ result: false, error: 'Invalid credentials' });
    }
  });
});


app.post('/addProduct', (req, res) => {
  var product  = {
    strTitle: req.body.strTitle,
    sreDetail: req.body.sreDetail,
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
      res.status(500).send('Failed to add a new row with default values');
    } else {
      res.status(200).send('Row with default values added successfully');
    }
  });
});

app.put('/editProduct/:iProduct', (req, res) => {
  const iProduct = req.params.iProduct;

  const updatedProduct = {
    strTitle: req.body.strTitle,
    sreDetail: req.body.sreDetail,
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