const express = require('express');
const router = express.Router();
const swaggerAutogen = require('swagger-autogen')();

// router.get('/', (req, res) => {
//   res.send('Welcome to your Local Library Home Page!');
// });

router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/', require('./swagger')) //Api-docs

module.exports = router;