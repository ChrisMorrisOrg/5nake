var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

var DB_HOST = "localhost";
var DB_USER = "username";
var DB_PASS = "password";
var DB_NAME = "5nake";

app.post('/plays', function(req, res){
  var difficulty = req.body.difficulty;
  var score = req.body.score;
  var version = req.body.version;
  var snake_weight = req.body.snake_weight;
  var canvas_width = req.body.canvas_width;
  var canvas_height = req.body.canvas_height;
  var screenshot = req.body.screenshot;

  // If these details are not submitted, then the user is likely running an old vesion of the game
  // Submit the default values
  if(snake_weight == null && canvas_width == null && canvas_height == null){
    snake_weight = 10;
    canvas_width = 430;
    canvas_height = 310;
  }

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
    connection.query('INSERT INTO plays (difficulty, score, version, snake_weight, canvas_width, canvas_height, screenshot) VALUES (?, ?, ?, ?, ?, ?, ?)', [difficulty, score, version, snake_weight, canvas_width, canvas_height, screenshot], function(err, rows, fields) {});
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
