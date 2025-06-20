var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mysql = require('mysql2');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalkService'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// API Routes

// GET /api/dogs - Return all dogs with size and owner's username
app.get('/api/dogs', (req, res) => {
    try {
        const query = `
            SELECT d.name as dog_name, d.size, u.username as owner_username
            FROM Dogs d
            JOIN Users u ON d.owner_id = u.user_id
        `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/walkrequests/open - Return all open walk requests
app.get('/api/walkrequests/open', (req, res) => {
    try {
        const query = `
            SELECT
                wr.request_id,
                d.name as dog_name,
                wr.requested_time,
                wr.duration_minutes,
                wr.location,
                u.username as owner_username
            FROM WalkRequests wr
            JOIN Dogs d ON wr.dog_id = d.dog_id
            JOIN Users u ON d.owner_id = u.user_id
            WHERE wr.status = 'open'
        `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// GET /api/walkers/summary - Return walker summary with ratings
app.get('/api/walkers/summary', (req, res) => {
    try {
        const query = `
            SELECT
                u.username as walker_username,
                COUNT(wr.rating_id) as total_ratings,
                COALESCE(AVG(wr.rating), null) as average_rating,
                COUNT(DISTINCT wa.request_id) as completed_walks
            FROM Users u
            LEFT JOIN WalkApplications wa ON u.user_id = wa.walker_id
                AND wa.status = 'accepted'
            LEFT JOIN WalkRatings wr ON wa.walker_id = wr.walker_id
            WHERE u.role = 'walker'
            GROUP BY u.user_id, u.username
        `;

        db.query(query, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
