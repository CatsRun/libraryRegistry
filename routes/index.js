const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Welcome to your Local Library Home Page!');
});

router.use('/books', require('./books'));
router.use('/users', require('./users'));

module.exports = router;