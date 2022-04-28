const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const authRouters = require('./routers/authRouters');
const authSqlRouters = require('./routers/authSqlRouters');
const applicationRouters = require('./routers/applicationRouters');
const remotiveRouters = require('./routers/remotiveRouters');
const preferenceRouters = require('./routers/preferenceRouters');

const MONGO_URI =
  'mongodb+srv://adamlang:iterationproject@cluster0.1fk97.mongodb.net/ITERATIONPROJECT?retryWrites=true&w=majority';

const app = express();
const PORT = 3000;
mongoose.connect(MONGO_URI);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.resolve(__dirname, '../build')));

app.use('/api', applicationRouters);
app.use('/api/auth', authSqlRouters);
app.use('/api/auth/calendar', authRouters);
app.use('/api/preferences', preferenceRouters);
app.use('/api/jobs/', remotiveRouters);

//For all routes access the index.html file
app.get('*', (req, res) => {
  res
    .status(200)
    .sendFile('index.html', { root: path.join(__dirname, '../build') });
});

//Catch all error handler
app.use((req, res) =>
  res.status(404).send("This is not the page you're looking for...")
);

//Global Error Handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  return res.status(errorObj.status).json(errorObj.message);
});

//Listens to port 3000
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
