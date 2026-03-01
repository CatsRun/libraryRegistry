const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const validate = require('../middleware/validateUser');

const authLogin = require('../middleware/auth')

// routes that connect to controllers functions

//getAll
router.get('/', authLogin.loggedIn, controller.getAll);

// // getSingle
router.get('/:id',  controller.getSingle);

// post createUser
router.post('/', validate.userRules(), validate.checkUserData,controller.createUser);

// put updateUser
router.put('/:id', validate.userRules(), validate.checkUserData,controller.updateUser);  

// delete deleteUser
router.delete('/:id', controller.deleteUser);

module.exports = router;