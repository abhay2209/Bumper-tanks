const express = require('express');
const path = require('path');
var http = require('http');
var app = express();
var socketIO = require('socket.io');
var server = http.Server(app);
var io = socketIO(server);

const PORT = process.env.PORT || 5000


io.on('connection', function(socket) {
});

/* const { Pool } = require('pg');

var pool;
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});
*/

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/matter-build', express.static(__dirname + '/node_modules/matter-js/build/'))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {res.sendFile(__dirname + '/public/src/gameCanvas.html');}); // Renders Home Page
  /*
app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  });
  */
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
/*
setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);
*/
