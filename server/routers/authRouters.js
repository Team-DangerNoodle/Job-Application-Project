const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { google } = require('googleapis');


const oauth2Client = new google.auth.OAuth2(
  // client id
  '88796443278-tm040jrfovse910ssio41o6hd26m5nk8.apps.googleusercontent.com',
  // client secret'',
  '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',
  // local host 8080 'http://localhost:8080'
  'http://localhost:8080'
)

// Handles the post request to the signup page
// Takes the username & password from req.body & creates a new username in the database and then returns the userId object back to the client (frontend)

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  if (username && password) {
    console.log(username, password);
    try {
      const userInDb = await User.create({ username, password });
      res.locals.userId = userInDb._id;
      return res.status(200).json(res.locals.userId);
    } catch (err) {
      return next({
        log: 'Error occurred with sign up. Try again',
        message: { err: 'Must have a username and password' },
      });
    }
  }
});

// Handles the post request to the login page
// Takes the username and password from req.body and finds the username returns a boolean, isMatch, if the password matches and returns the userId to client (frontend)

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  User.findOne(
    {
      username
    },
    async (error, user) => {
      if (error || user === null) {
        return next({
          log: 'Error occurred with logging in. Try again',
          message: { err: error },
        });
      } else {
        console.log('testing');
        const isMatch = await user.comparePassword(password, next);
        if (isMatch) {
          res.locals.userId = user._id;
          return res.status(200).json(res.locals.userId);
        } else {
          return next({
            log: 'Error occurred with logging in. Try again',
            message: { err: 'Wrong username or password' },
          });
        }
      }
    }
  );
});

router.post('/oauth', async (req, res, next) => {
  const { gmail, googleId } = req.body;
  const username = gmail;
  const password = googleId;

  try {
    User.findOne({ username }, async (err, user) => {
      if (err) {
        return next({
          log: 'Error occured in authentication',
          message: { err: err.message },
        });
      } else if (user === null) {
        const newUser = await User.create({ username, password });
        console.log(newUser)
        res.locals.userId = newUser._id;
        return res.status(200).json(res.locals.userId);
      } else {
        console.log('mongodb find one');
        const verify = await user.comparePassword(password, next);
        if (verify) {
          res.locals.userId = user._id;
          return res.status(200).json(res.locals.userId);
        } else {
          return next({
            log: 'Error occured in authentication',
            message: { err: err.message },
          });
        }
      }
    });
  } catch (err) {
    return next({
      log: 'Error occurred with google logging in. Try again',
      message: {
        err: err,
      },
    });
  }
});





/// create event router
router.post('/addCalendarEvent', async (req, res, next) => {
  try {
    const { accessToken } = req.body
    console.log("access token backend", accessToken)
    oauth2Client.setCredentials({ access_token: accessToken })
    console.log(oauth2Client)
    const calendar = await google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: {
        summary: "testsummary",
        description: 'testdesc',
        location: 'testloc',
        colorId: '7',
        start: {
          dateTime: "2022-04-27T06:00:00-07:00",
          timeZone: "America/Los_Angeles"
        },
        end: {
          dateTime: "2022-04-27T09:00:00-07:00",
          timeZone: "America/Los_Angeles"
        }
      }
    })
         console.log('addCalendarEvent middleware completed');
         res.send(response)
       } catch(error) {
      console.log('catch error: ', error);
    } 
    })
    



module.exports = router;

