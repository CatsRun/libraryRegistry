const express = require('express');
const router = express.Router();
const swaggerAutogen = require('swagger-autogen')();
const welcomeMessage = `
    <h1>Welcome to your Local Library Home Page!</h1>
    <ul>
      <li>For a list of <strong>books</strong> → <code>/books</code></li>
      <li>For a list of <strong>users</strong> → <code>/users</code></li>
      <li>For <strong>API Documentation</strong> → <code>/api-docs</code></li>
    </ul>`;
    
router.get('/', (req, res) => {
  res.send(welcomeMessage);
});

router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/', require('./swagger')) //Api-docs

module.exports = router;