const express = require('express');
const router = express.Router();
const controller = require('../controllers/books');
const validate = require('../middleware/validateBook');

// routes that connect to controllers functions

//getAll
router.get('/', controller.getAll);

// getSingle
router.get('/:id', controller.getSingle);

// post, create new book
router.post('/', validate.bookRules(), validate.checkBookData, controller.createBook);

// put updateBook
router.put('/:id', validate.bookRules(), validate.checkBookData, controller.updateBook);

// delete deleteBook
router.delete('/:id', controller.deleteBook); 

module.exports = router;