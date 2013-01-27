var express	= require('express');
var mysql       = require('mysql');
var app		= express();

app.use(express.bodyParser());

var DB_HOST = "localhost";
var DB_USER = "username";
var DB_PASS = "password";
var DB_NAME = "5nake";

app.post('/plays', function(req, res){
  var difficulty	= req.body.difficulty;
  var score     	= req.body.score;
  var version   	= req.body.version;

  // Connect to MySQL database
  var connection  = mysql.createConnection({
    host          : DB_HOST,
    user          : DB_USER,
    password      : DB_PASS,
    database      : DB_NAME,
  });

  connection.connect();

  // If the score, difficulty, and version is posted, record it.
  if(typeof score != "undefined" && typeof difficulty != "undefined" && typeof version != "undefined"){
    console.log("POST: 5nake Game Ended, score = " + score + ", difficulty = " + difficulty + ", using version = " + version);
    connection.query('INSERT INTO plays (difficulty, score, version) VALUES (?, ?, ?)', [difficulty, score, version], function(err, rows, fields) {});
  }

  // Return the number of games played
  connection.query('SELECT FORMAT(COUNT(*), 0) AS plays FROM plays;', function(err, rows, fields) {
    console.log("POST: Games played = " + rows[0]);
    res.setHeader('Content-Type', 'application/json');
    res.send(rows[0]);
  });

  // Close MySQL
  connection.end();

});

app.get('/plays', function(req, res){

  // Connect to MySQL database
  var connection  = mysql.createConnection({
    host          : DB_HOST,
    user          : DB_USER,
    password      : DB_PASS,
    database      : DB_NAME,
  });

  connection.connect();
  // Return the number of games played
  connection.query('SELECT FORMAT(COUNT(*), 0) AS plays FROM plays;', function(err, rows, fields) {
    console.log("GET: Games played = " + rows[0]);
    res.setHeader('Content-Type', 'application/json');
    res.send(rows[0]);
  });

  // Close MySQL
  connection.end();

});


app.listen(3001);
