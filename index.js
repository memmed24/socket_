var express = require('express');
var app = express();
var socket = require('socket.io');
const mysql = require('mysql');

//create connecion
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'personal'
});

db.connect((err) => {
  if(err){
    throw err;
  }
  console.log("Mysql Connection was successfull");
})

let port = 3000;

var server = app.listen(port, (req, res) => {

  console.log(`Listening on port ${port}`);

});

let connectedusers = 0;

app.use(express.static('public'));
const io = socket(server);

app.get('/test', (req, res) => {
  let query = `SELECT user_id, 
                      user_name,
                      user_surname,
                      user_username,
                      user_token FROM users`;
  db.query(query, (err, result) => {
    if(err) throw err;
    
    res.json(result);
  });
})

io.on('connection', (socket) => {
  connectedusers++;
  // console.log('');
  console.log('Count: ' + io.engine.clientsCount);

  socket.on('chat', (data) => {

    let query = "INSERT INTO messages "
    io.sockets.emit('chat', data)

  });

  // mysql.

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

});
io.on('disconnect', (socket) => {
  connectedusers--;
});