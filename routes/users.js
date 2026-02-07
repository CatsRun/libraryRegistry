const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

// routes that connect to controllers functions

//getAll
router.get('/', controller.getAll);

// getSingle
// router.get('/:id', controller.getSingle);

// post createUser

// put updateUser

// delete deleteUser

module.exports = router;