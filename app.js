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