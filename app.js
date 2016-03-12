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

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3000);

app.get('/db', function(req, res, next) {
	var context = {};

	pool.query('SELECT * FROM student', function(err, row, fields) {
		if(err) {
			next(err);
			return;
		}

		context.results = JSON.stringify(rows);
		res.render('/db');
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