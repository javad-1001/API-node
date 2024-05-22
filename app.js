const express =  require('express') ;
const bodyParser =  require('body-parser') ;

const app = express();

const PORT = 5000;

app.use(bodyParser.json());




// query for add user
//INSERT INTO `users` (`id`, `username`, `password`, `phone`) VALUES (NULL, 'javad', '1234', '09123456789'); 



var mysql      = require('mysql');
const e = require('express');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'javad',
  password : 'javad',
  database : 'mehran_db'
});

connection.connect(function(err) {
  // connected! (unless `err` is set)
});


app.post('/api/addUser',
    (req, res) => {
      const { strPassword, iMobileNumber, strName, strFamily, iRole, bActive } = req.body;

      const insertQuery = `INSERT INTO users (strPassword, iMobileNumber, strName, strFamily, iRole, bActive) VALUES (?, ?, ?, ?, ?, ?)`;
      const values = [strPassword, iMobileNumber, strName, strFamily, iRole, bActive];
    
      connection.query(insertQuery, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Failed to insert user');
        }
        
        res.status(201).send('User inserted successfully');
      });
      
    });



app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
  });

  app.get('/', (req, res) => {
    console.log('[GET ROUTE]');
    res.send('HELLO FROM HOMEPAGE');
})


// app.post('/api/todos',
//     (req, res) => {
//         const { username, password } = req.body;
//         const { authorization } = req.headers;
//         res.send(
//             {
//                 username,
//                 password,
//                 message: 'done successfully!' ,
//                 authorization,
//             });
//     });

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));