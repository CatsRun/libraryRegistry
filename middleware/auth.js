const { validationResult } = require("express-validator")
const authLogin = {}


// make graceful redirect
authLogin.loggedIn = (req, res, next) => {
    const errors = validationResult(req);
 if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')
    }
next();
};

// authLogin.loggedOut = (req, res, next) => {
//  if (!req.isAuthenticated()) {
//       return next();
//     } else {
//       res.redirect('/');
//     }
// next();
// };

module.exports = authLogin