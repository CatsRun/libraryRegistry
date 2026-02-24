const express = require('express');
  const { body, validationResult } = require("express-validator")
  const validate = {}

//   Validate user

validate.userRules = () => {
    return [
      // firstname is required and must be string
        body ("user_id") //this checks to see if the id is valid. 
        .trim()    
        .escape()
        .notEmpty()
        .withMessage("Please provide your user id."),

      body("firstName")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide your first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("lastName")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide your last name."), // on error this message is sent.

      body("email")
        .notEmpty()
        // .trim()
        // .isEmail()
        // .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),

        body ("phoneNumber")
        .trim()    
        .escape()
        .notEmpty()
        // .isLength({ min: 10 })
        .withMessage("Please provide a valid number."),
    ]
}

validate.checkUserData = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
next();
};


module.exports = validate