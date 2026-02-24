  const { body, validationResult } = require("express-validator")
  const validate = {}

//   Validate book

validate.bookRules = () => {
    return [
      // isbn is required and must be string
      body("isbn")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide the isbn."), // on error this message is sent.
  
      // title is required and must be string
      body("title")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide the book title."), // on error this message is sent.

        body ("author")
        .trim()    
        .escape()
        .notEmpty()
        .withMessage("Please provide the author's name."),
    ]


}

validate.checkBookData = (req, res, next) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
next();
};

module.exports = validate