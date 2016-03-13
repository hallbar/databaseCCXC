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

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

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

app.use('/static', express.static('public'));

app.get('/db', function(req, res, next) {
	var context = {};

	pool.query('SELECT * FROM workouts', function(err, rows, fields) {
		if (err) {
			next(err);
			return;
		}

		context.results = rows;
		res.render('db', context);
	});
});

app.post('/db', function(req, res, next) {

	if (req.body.addItem) {
		var context = {};
		// pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result) {
		pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, result) {
			if (err) {
				next(err);
				return;
			}
			pool.query('SELECT * FROM workouts', function(err, rows, fields) {
				if (err) {
					next(err);
					return;
				}
				console.log(rows);
				context.results = rows;

				res.render('db', context);
			});
		});
	}
});

app.get('/edit', function(req, res, next) {
	var context = {};
	pool.query("SELECT * FROM workouts WHERE id=" + req.query.id, function(err, rows, fields) {
		if (err) {
			next(err);
			return;
		}
		context.results = rows;
		res.render('edit', context);
	});

});

app.post('/edit', function(req, res, next) {
	var context = {};
	pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ", [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs, req.body.id],
		function(err, rows, fields) {
			if (err) {
				next(err);
				return;
			}
			context.results = rows;
			res.render('db', context);
		});
});

app.get('/reset-table', function(req, res, next) {
	var context = {};
	pool.query("DROP TABLE IF EXISTS workouts", function(err) { //replace your connection pool with the your variable containing the connection pool
		var createString = "CREATE TABLE workouts(" +
			"id INT PRIMARY KEY AUTO_INCREMENT," +
			"name VARCHAR(255) NOT NULL," +
			"reps INT," +
			"weight INT," +
			"date DATE," +
			"lbs BOOLEAN)";
		pool.query(createString, function(err) {
			context.results = "Table reset";
			res.render('db', context);
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