const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const validate = require('../middleware/validateUser');

// routes that connect to controllers functions

//getAll
// router.get('/', controller.getAll);

// // getSingle
// router.get('/:id', controller.getSingle);

// // post createUser
// router.post('/', controller.createUser);

// // put updateUser
// router.put('/:id', controller.updateUser);  

// // delete deleteUser
// router.delete('/:id', controller.deleteUser);

module.exports = router;

// // getSingle
router.get('/:id', validate.userRules(controller.getSingle));

// post createUser
router.post('/', validate.userRules(controller.createUser));

// put updateUser
router.put('/:id', validate.userRules(controller.updateUser));  

// delete deleteUser
router.delete('/:id', validate.userRules(controller.deleteUser));