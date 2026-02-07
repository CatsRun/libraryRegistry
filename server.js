const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');

const port = process.env.PORT || 8080;
const app = express();

app 
    .use(bodyParser.json())
    .use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); //'*' allows anyone to change db things, cahnge this for production.
    next();
    })
    .use('/', require('./routes'));

    mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port); 
    console.log(`Connected to DB and listening on ${port}`);
  }
}); 