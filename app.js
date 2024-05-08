const express =  require('express') ;
const bodyParser =  require('body-parser') ;

const app = express();

const PORT = 5000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    console.log('[GET ROUTE]');
    res.send('HELLO FROM  dHOMEPAGE');
})



app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello, World!' });
  });

// app.post('/api/todos', (req, res) => {
//     const newTodo = req.body;
//     todos.push(newTodo);
//     res.status(201).json(newTodo);
// });

app.post('/api/todos',
    (req, res) => {
        const { username, password } = req.body;
        const { authorization } = req.headers;
        res.send(
            {
                username,
                password,
                message: 'done successfully!' ,
                authorization,
            });
    });

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));