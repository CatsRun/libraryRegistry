const express = require('express');
const router = express.Router();
const controller = require('../controllers/books');

// routes that connect to controllers functions

//getAll
router.get('/', controller.getAll);

// getSingle
router.get('/:id', controller.getSingle);

// post createBook
router.post('/', controller.createBook);

// put updateBook
router.put('/:id', controller.updateBook);

// delete deleteBook
router.delete('/:id', controller.deleteBook); 

module.exports = router;