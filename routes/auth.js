// const express = require('express');
// const router = express.Router();
// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oidc');
// var db = require('../db/connect');

// passport.use(new GoogleStrategy({
//   clientID: process.env['GOOGLE_CLIENT_ID'],
//   clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
//   callbackURL: '/oauth2/redirect/google',
//   scope: [ 'profile' ]
// }, function verify(issuer, profile, cb) {
//   db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
//     issuer,
//     profile.id
//   ], function(err, row) {
//     if (err) { return cb(err); }
//     if (!row) {
//       db.run('INSERT INTO users (name) VALUES (?)', [
//         profile.displayName
//       ], function(err) {
//         if (err) { return cb(err); }
        
//         var id = this.lastID;
//         db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
//           id,
//           issuer,
//           profile.id
//         ], function(err) {
//           if (err) { return cb(err); }
//           var user = {
//             id: id,
//             name: profile.displayName
//           };
//           return cb(null, user);
//         });
//       });
//     } else {
//       db.get('SELECT * FROM users WHERE id = ?', [ row.user_id ], function(err, row) {
//         if (err) { return cb(err); }
//         if (!row) { return cb(null, false); }
//         return cb(null, row);
//       });
//     }
//   });
// }));

// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function(user, cb) {
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });


// router.get('/login', function(req, res, next) {
//   res.render('login');
// });
// router.get('/login/federated/google', passport.authenticate('google'));

// // redirect back from Google
// router.get('/oauth2/redirect/google', passport.authenticate('google', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }));

// module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oidc');
const mongodb = require('../db/connect');           // your MongoDB connection
const { ObjectId } = require('mongodb');

// Helper to get the users collection
const getUsersCollection = () => mongodb.getDb().db().collection('users');
const getFederatedCollection = () => mongodb.getDb().db().collection('federated_credentials');

// ────────────────────────────────────────────────
// Passport Google OIDC Strategy
// ────────────────────────────────────────────────
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/oauth2/redirect/google',
  scope: ['profile', 'email']           // added 'email' — usually useful
}, async function verify(issuer, profile, cb) {
  try {
    // Look for existing link between Google account and a user
    const cred = await getFederatedCollection().findOne({
      provider: issuer,
      subject: profile.id
    });

    if (cred) {
      // Found → get the existing user
      const user = await getUsersCollection().findOne({ _id: new ObjectId(cred.user_id) });
      if (!user) {
        return cb(null, false); // linked user was deleted → treat as no account
      }
      return cb(null, user);
    }

    // No existing link → create new user
    const newUser = {
      firstName: profile.name.givenName || '',
      lastName: profile.name.familyName || '',
      email: profile.emails?.[0]?.value || null,
      phoneNumber: '',                    // can ask user to fill later
      address: '',
      memberStatus: 'active',             // or whatever default you want
      // user_id field — if you still want it, maybe use profile.id or generate UUID
      // but most apps drop it and use _id as the main identifier
      createdAt: new Date()
    };

    const insertResult = await getUsersCollection().insertOne(newUser);
    const userId = insertResult.insertedId;

    // Link the Google account to this new user
    await getFederatedCollection().insertOne({
      user_id: userId.toString(),   // store as string or ObjectId — string is simpler
      provider: issuer,
      subject: profile.id
    });

    // Return the new user object (Passport expects it)
    newUser._id = userId;
    return cb(null, newUser);

  } catch (err) {
    return cb(err);
  }
}));

// ────────────────────────────────────────────────
// Serialize / Deserialize
// We store just the minimal user info in the session
// ────────────────────────────────────────────────
passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, {
      id: user._id.toString(),      // always use string for safety
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
      // add more fields if you need them often in req.user
    });
  });
});

passport.deserializeUser(async function(user, cb) {
  process.nextTick(async function() {
    try {
      // Optional: re-fetch full user from DB on each request (recommended for freshness)
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

// ────────────────────────────────────────────────
// Routes
// ────────────────────────────────────────────────
router.get('/login', (req, res) => {
  res.render('login');           // or send JSON / redirect depending on your frontend
});

router.get('/login/federated/google',
  passport.authenticate('google')
);

// Google redirect callback
router.get('/oauth2/redirect/google',
  passport.authenticate('google', {
    successRedirect: '/users',           // or '/dashboard', '/profile', etc.
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