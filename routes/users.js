const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const validate = require('../middleware/validateUser');

// routes that connect to controllers functions

//getAll
router.get('/', controller.getAll);

// // getSingle
// router.get('/:id', controller.getSingle);

// // post createUser
// router.post('/', controller.createUser);

// // put updateUser
// router.put('/:id', controller.updateUser);  

// // delete deleteUser
// router.delete('/:id', controller.deleteUser);


// // getSingle
router.get('/:id',  controller.getSingle);

// post createUser
router.post('/', validate.userRules(), validate.checkUserData,controller.createUser);

// put updateUser
router.put('/:id', validate.userRules(), validate.checkUserData,controller.updateUser);  

// delete deleteUser
router.delete('/:id', controller.deleteUser);

module.exports = router;