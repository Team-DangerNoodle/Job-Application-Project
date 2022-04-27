const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

const bcrypt = require('bcryptjs');
const db = require('../models/userSqlModel');
const SALT_WORK_FACTOR = 10;


// Handles the post request to the signup page
// Takes the username & password from req.body & creates a new username in the database and then returns the userId object back to the client (frontend)
// router.post('/signup', async (req, res, next) => {
//   const { username, password } = req.body;
//   if (username && password) {
//     console.log(username, password);
//     try {
//       const userInDb = await User.create({ username, password });
//       res.locals.userId = userInDb._id;
//       return res.status(200).json(res.locals.userId);
//     } catch (err) {
//       return next({
//         log: 'Error occurred with sign up. Try again',
//         message: { err: 'Must have a username and password' },
//       });
//     }
//   }
// });

// Handles the post request to the login page
// Takes the username and password from req.body and finds the username returns a boolean, isMatch, if the password matches and returns the userId to client (frontend)
// router.post('/login', (req, res, next) => {
//   const { username, password } = req.body;
//   User.findOne(
//     {
//       username,
//     },
//     async (error, user) => {
//       if (error || user === null) {
//         return next({
//           log: 'Error occurred with logging in. Try again',
//           message: { err: error },
//         });
//       } else {
//         console.log('testing');
//         const isMatch = await user.comparePassword(password, next);
//         if (isMatch) {
//           res.locals.userId = user._id;
//           return res.status(200).json(res.locals.userId);
//         } else {
//           return next({
//             log: 'Error occurred with logging in. Try again',
//             message: { err: 'Wrong username or password' },
//           });
//         }
//       }
//     }
//   );
// });

// router.post('/oauth', async (req, res, next) => {
//   const { gmail, googleId } = req.body;
//   const username = gmail;
//   const password = googleId;

//   try {
//     User.findOne({ username }, async (err, user) => {
//       if (err) {
//         return next({
//           log: 'Error occured in authentication',
//           message: { err: err.message },
//         });
//       } else if (user === null) {
//         const newUser = await User.create({ username, password });
//         res.locals.userId = newUser._id;
//         return res.status(200).json(res.locals.userId);
//       } else {
//         console.log('mongodb find one');
//         const verify = await user.comparePassword(password, next);
//         if (verify) {
//           res.locals.userId = user._id;
//           return res.status(200).json(res.locals.userId);
//         } else {
//           return next({
//             log: 'Error occured in authentication',
//             message: { err: err.message },
//           });
//         }
//       }
//     });
//   } catch (err) {
//     return next({
//       log: 'Error occurred with google logging in. Try again',
//       message: {
//         err: err,
//       },
//     });
//   }
// });

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    console.log('authSqlRouter /signUp username, password: ', username, password);
    try {
      const hash = await bcrypt.hash(password, SALT_WORK_FACTOR);

      const userInDb = await db.query('INSERT INTO users(id, name, password) VALUES (DEFAULT, $1, $2) RETURNING *', [username, hash]);
      res.locals.userId = userInDb.rows[0].id;
      console.log('res.locals.addedUser :', res.locals.userId);
      return res.status(200).json(res.locals.userId);
    } catch (err) {
      return next({
        log: `Error occurred with sign up. Try again. err: ${err}`,
        message: { err: 'Must have a username and password' },
      });
    }
  }
});

router.post('/login', async (req, res, next) => {
  console.log('i am here');
  const { username, password } = req.body;
  try {
    if (!username || !password) throw new Error('Please enter both username and password to login');
    const userInDb = await db.query('SELECT * FROM users WHERE name = $1', [username]);
    if (userInDb.rows[0] === undefined) {
      throw new Error('Username does not exist.');
    }
    console.log('login db returned object: ', userInDb.rows[0]);
    const isMatch = await bcrypt.compare(password, userInDb.rows[0].password);
    console.log('isMatch: ', isMatch);
    if (isMatch) {
      res.locals.userId = userInDb.rows[0].id;
      return res.status(200).json(res.locals.userId);
    }
    throw new Error('Password does not match for user: ', username);
  } catch (err) {
    return next({
      log: `Error occurred with logging in. ${err} `,
      message: { err: 'Wrong username or password' },
    });
  }
});

router.post('/oauth', async (req, res, next) => {
  const { gmail, googleId } = req.body;
  const username = gmail;
  const password = googleId;
  try {
    let userInDb = await db.query('SELECT * FROM users WHERE name  = $1', [username]);
    if (userInDb.rows[0] === undefined) {
      const hash = await bcrypt.hash(password, SALT_WORK_FACTOR);

      userInDb = await db.query('INSERT INTO users(id, name, password) VALUES (DEFAULT, $1, $2) RETURNING *', [username, hash]);
      res.locals.userId = userInDb.rows[0].id;
      console.log('res.locals.addedUser :', res.locals.userId);
      return res.status(200).json(res.locals.userId);
    }
    const isMatch = await bcrypt.compare(password, userInDb.rows[0].password);
    console.log('isMatch: ', isMatch);
    if (isMatch) {
      res.locals.userId = userInDb.rows[0].id;
      return res.status(200).json(res.locals.userId);
    }
    throw new Error('Password does not match for user: ', username);
  } catch (err) {
    return next({
      log: `Error occurred with google logging in. ${err} `,
      message: {
        err: 'Unable to login. Please try again',
      },
    });
  }
});


module.exports = router;
