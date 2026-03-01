const express = require('express');
const path = require('path');
var session = require('express-session');
var SQLiteStore = require('connect-sqlite3')(session);
var passport = require('passport');

const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const app = express();
const port = process.env.PORT || 8080;
// to maintain State, passport
// var logger = require('morgan');

app 
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); //'*' allows anyone to change db things, cahnge this for production.
    next();
    })


    mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port); 
    console.log(`Connected to DB and listening on ${port}`);
  }
}); 

// user login ...

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');





//session support middleware
// app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './var/db',
    mongodb
   })
}));

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false,
//   store: new SQLiteStore({ db: 'sessions.db', dir: './var/db' })
// }));
app.use(passport.authenticate('session'));

// these need to be at the end
app.use('/', require('./routes'));
app.use('/', indexRouter);
app.use('/', authRouter);

// // Passport
// app.use(passport.initialize())
// app.use(passport.sessions()) //do I need to add this? video 41 min https://www.youtube.com/watch?v=SBvmnHTQIPY 