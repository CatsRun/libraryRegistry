const express = require('express');
const router = express.Router();
const controller = require('../controllers/books');

// routes that connect to controllers functions

//getAll
router.get('/', controller.getAll);

// getSingle
// router.get('/:id', controller.getSingle);

// post createBook

// put updateBook

// delete deleteBook

module.exports = router;