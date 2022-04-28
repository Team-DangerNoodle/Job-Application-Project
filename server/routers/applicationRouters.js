const express = require('express');
const router = express.Router();
const Application = require('../models/applicationModel');

// req.body => form body
// /applications/userId
// priority: High: 0, Med: 1, Low :2

const priorityConverter = (priority) => {
  const lookup = {
    High: 0,
    Med: 1,
    Low: 2,
  };

  if (lookup.hasOwnProperty(priority)) {
    return lookup[priority];
  } else {
    return Object.keys(lookup).find((k) => lookup[k] === priority);
  }
};

// creates a new job application & sends it back to the frontend to display fields
router.post('/applications/:userId', async (req, res, next) => {
  const userId = req.params.userId.toString();
  const {
    title,
    url,
    company_name,
    company_logo,
    category,
    job_type,
    publication_date,
    candidate_required_location,
    salary,
    description,
    remotive_id,
    progress,
    priority,
  } = req.body;

  // here we convert the level of priority to a number so we can sort it later
  const convertedPriority = priorityConverter(priority);

  try {
    const newApplication = await Application.create({
      title,
      url,
      company_name,
      company_logo,
      category,
      job_type,
      publication_date,
      candidate_required_location,
      salary,
      description,
      remotive_id,
      progress,
      userId,
      priority: convertedPriority,
    });
    res.locals.application = newApplication;
    return res.status(200).json(res.locals.application);
  } catch (err) {
    return next({
      log: err,
      message: {
        err: err.message,
      },
    });
  }
});

// return all the applications that the user has sorted by priority
router.get('/applications/:userId', async (req, res, next) => {
  const { userId } = req.params;

  try {
    const applications = await Application.find({ userId: userId }).sort({
      priority: 1,
    });
    if (applications.length === 0) {
      return next({
        log: 'No applications found for this user',
        message: { err: 'No applications found for this user' },
      });
    }
    const updatedData = applications.map((app) => {
      return { ...app._doc, priority: priorityConverter(app._doc.priority) };
    });
    return res.status(200).json(updatedData);
  } catch (err) {
    return next(err);
  }
});

// makes updates to an existing application
router.post('/application/:appId', async (req, res, next) => {
  const {
    // title,
    // url,
    // company_name,
    // company_logo,
    // category,
    // job_type,
    // publication_date,
    // candidate_required_location,
    // salary,
    // description,
    // remotive_id,
    progress,
    // priority,
  } = req.body;
  const { appId } = req.params;
  // const convertedPriority = priorityConverter(priority);
  const update = {
    // title,
    // url,
    // company_name,
    // company_logo,
    // category,
    // job_type,
    // publication_date,
    // candidate_required_location,
    // salary,
    // description,
    // remotive_id,
    progress,
    // priority: convertedPriority,
  };
  Application.findByIdAndUpdate(appId, update, {
    userFindAndModify: false,
  })
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: `Cannot find data with id ${appId}` });
      } else {
        res.status(200).json({ message: 'Update successful', data });
      }
    })
    .catch((err) => next(err));
});

// deletes an existing application
router.delete('/application/:appId', (req, res, next) => {
  const { appId } = req.params;
  Application.findOneAndRemove({ _id: appId }, function (err, doc) {
    if (err) {
      return next({
        log: 'Error occurred with deleting an application',
        message: { err: err.message },
      });
    }
    return res.status(200).json('Successfully deleted an application');
  });
});
module.exports = router;
