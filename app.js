const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const bodyParser = require('body-parser');




const port = 3000;

//cors
app.use(cors());


// Middleware to parse JSON bodies
app.use(express.json());
app.use(bodyParser.json());
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'abhi',
  password: 'Root@12345', // your MySQL root password
  database: 'todoapp' // your database name
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/', (req, res) => {
  res.send('Hello from the todo app backend!');
});

app.post('/add-pending-tasks', (req, res) => {
  const { task } = req.body;
  const query = 'INSERT INTO pending_tasks (task) VALUES (?)';
  connection.query(query, [task], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).send('Error adding task');
      return;
    }
    res.status(201).send({ id: result.insertId, task });
  });
});

app.get('/all-pending-tasks',(req,res)=>
{
  const query="SELECT * FROM pending_tasks";
  connection.query(query,(err,result)=>
  {
    if(err){
      console.error('error in getting all pending task',err);
      res.status(500).send('error in getting all pending task')
    }
    res.status(201).send({"allTasks":result});
  });
});

app.get('/all-completed-tasks',(req,res)=>
  {
    const query="SELECT * FROM completed_tasks";
    connection.query(query,(err,result)=>
    {
      if(err){
        console.error('error in getting all completed task',err);
        res.status(500).send('error in getting all completed task')
      }
      res.status(201).send({"allTasks":result});
    });
  });
  
  app.get('/clear-all',(req,res)=>
    {
      const query="DELETE FROM completed_tasks";
      connection.query(query,(err,result)=>
      {
        if(err){
          console.error('error in Deleting all completed task',err);
          res.status(500).send('error in Deleting all completed task')
        }
        res.status(201).send(result);
      });
    });
    

//we need to delete task from pending table and add to completed table
app.post('/complete-task', (req, res) => {
  const { id } = req.body;
 //delete from pending table
  const query = 'DELETE FROM pending_tasks WHERE id = ?';
  connection.query(query, id, (err, result) => {
    if (err) {
      console.error('Error completing task:', err);
      res.status(500).send('Error completing task');
      return;
    }
    res.status(201).send(result);
  });



});

app.post('/add-completed-tasks',(req,res)=>{
    //add in completed table

  const { task } = req.body;
  const query2 = 'INSERT INTO completed_tasks (task) VALUES (?)';
  connection.query(query2, [task], (err, result) => {
    if (err) {
      console.error('Error adding task:', err);
      res.status(500).send('Error adding task');
      return;
    }
    res.status(201).send({ id: result.insertId, task });
  });

});
 
app.delete('/pending-tasks/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM pending_tasks WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting task:', err);
      res.status(500).send('Error deleting task');
      return;
    }
    res.status(204).send();
  });
});

app.put('/pending-tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  const query = 'UPDATE pending_tasks SET task = ? WHERE id = ?';
  connection.query(query, [task, id], (err) => {
    if (err) {
      console.error('Error updating task:', err);
      res.status(500).send('Error updating task');
      return;
    }
    res.status(200).send({ id, task });
  });
});

// Route handling
app.get('/hello', (req, res) => {
  res.send({"name":"sagar"});
});

app.post('/sendData',(req,res)=>{
    res.send('this is post api')
})

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
