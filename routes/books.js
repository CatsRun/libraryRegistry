const express = require('express');
const router = express.Router();
const controller = require('../controllers/books');
const validate = require('../middleware/validateBook');

// routes that connect to controllers functions

//getAll
router.get('/', controller.getAll);

// getSingle
router.get('/:id', validate.bookRules(controller.getSingle));

// post createBook
router.post('/', validate.bookRules(controller.createBook));

// put updateBook
router.put('/:id', validate.bookRules(controller.updateBook));

// delete deleteBook
router.delete('/:id', validate.bookRules(controller.deleteBook)); 

module.exports = router;