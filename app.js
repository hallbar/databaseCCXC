var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({
	defaultLayout: 'main'
});

var mysql = require('mysql');
var pool = mysql.createPool({
	host: 'localhost',
	user: 'student',
	password: 'default',
	database: 'student'
});

var createString = "CREATE TABLE workouts(" +
	"id INT PRIMARY KEY AUTO_INCREMENT," +
	"name VARCHAR(255) NOT NULL," +
	"reps INT," +
	"weight INT," +
	"date DATE," +
	"lbs BOOLEAN)";

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/db', function(req, res, next) {
	var context = {};

	pool.query(createString, function(err){
		res.render('/db');
	});

	// pool.query('SELECT * FROM student', function(err, row, fields) {
	// 	if (err) {
	// 		next(err);
	// 		return;
	// 	}

	// 	context.results = JSON.stringify(rows);
	// 	res.render('/db');
	// });
});

app.get('/reset-table',function(req,res,next){
  var context = {};
  [your connection pool].query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    [your connection pool].query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});


// Error page not found
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

// Error server error
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

// Starts the web page
app.listen(app.get('port'), function() {
	console.log("");
	console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
	console.log("");
});