const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const mongodb = require('../db/connect');  
const { ObjectId } = require('mongodb');

const getUsersCollection = () => mongodb.getDb().db().collection('users');
const getFederatedCollection = () => mongodb.getDb().db().collection('federated_credentials');

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile', 'email']           
}, async function verify(issuer, profile, cb) {
  try {
    // Look for existing link between Google account and a user
    const cred = await getFederatedCollection().findOne({
      provider: issuer,
      subject: profile.id
    });

    if (cred) {
      // get the existing user
      const user = await getUsersCollection().findOne({ _id: new ObjectId(cred.user_id) });
      if (!user) {
        return cb(null, false); 
      }
      return cb(null, user);
    }

    // No existing link create new user
    const newUser = {
      firstName: profile.name.givenName || '',
      lastName: profile.name.familyName || '',
      email: profile.emails?.[0]?.value || null,
      phoneNumber: '',                    
      address: '',
      memberStatus: 'active',             
      createdAt: new Date()
    };

    const insertResult = await getUsersCollection().insertOne(newUser);
    const userId = insertResult.insertedId;

    // Link the Google account to this new user
    await getFederatedCollection().insertOne({
      user_id: userId.toString(),   
      provider: issuer,
      subject: profile.id
    });

    // Return the new user object 
    newUser._id = userId;
    return cb(null, newUser);

  } catch (err) {
    return cb(err);
  }
}));

// ────────────────────────────────────────────────
// Serialize / Deserialize
// ────────────────────────────────────────────────
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, {
      id: user._id.toString(),     
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });
  });
});

passport.deserializeUser(async function(user, cb) {
  process.nextTick(async function() {
    try {
      const fullUser = await getUsersCollection().findOne({ _id: new ObjectId(user.id) });
      if (!fullUser) {
        return cb(null, false);
      }
      cb(null, fullUser);
    } catch (err) {
      cb(err);
    }
  });
});

// Routes
router.get('/login', (req, res) => {
  res.render('login');          
});

router.get('/login/federated/google',
  passport.authenticate('google')
);

// Google redirect callback
router.get('/oauth2/redirect/google',
  passport.authenticate('google', {
    successRedirect: '/users',          
    failureRedirect: '/login'
  })
);

// Optional: logout route
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// router.post('/logout', function(req, res, next) {
//   req.logout(function(err) {    
//     if (err) { return next(err); }    
//     res.redirect('/');
//   });
// });

// router.post('/logout', (req, res, next) => {
//   req.logout((err) => {
//     if (err) { return next(err); }

//     req.session.destroy((err) => {
//       if (err) { return next(err); }

//       // Optional: clear the cookie explicitly (helps in some cases)
//       res.clearCookie('connect.sid');

//       res.redirect('/');
//     });
//   });
// });

module.exports = router;