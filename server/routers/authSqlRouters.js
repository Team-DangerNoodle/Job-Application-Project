const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();
const db = require('../models/userSqlModel');
const SALT_WORK_FACTOR = 10;

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    // console.log('authSqlRouter /signUp username, password: ', username, password);
    try {
      const hash = await bcrypt.hash(password, SALT_WORK_FACTOR);

      const userInDb = await db.query(
        'INSERT INTO users(id, name, password) VALUES (DEFAULT, $1, $2) RETURNING *',
        [username, hash]
      );
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
    if (!username || !password)
      throw new Error('Please enter both username and password to login');
    const userInDb = await db.query('SELECT * FROM users WHERE name = $1', [
      username,
    ]);
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
    let userInDb = await db.query('SELECT * FROM users WHERE name  = $1', [
      username,
    ]);
    if (userInDb.rows[0] === undefined) {
      const hash = await bcrypt.hash(password, SALT_WORK_FACTOR);

      userInDb = await db.query(
        'INSERT INTO users(id, name, password) VALUES (DEFAULT, $1, $2) RETURNING *',
        [username, hash]
      );
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
