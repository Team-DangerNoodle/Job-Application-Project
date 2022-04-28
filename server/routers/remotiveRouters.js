const express = require('express');
const router = express.Router();
// const fetch = require('node-fetch');

// conditional from post request
// Post Requests: Software Engineering job /Full-time/ Front-End Dev
const apiUrl =
  'https://remotive.com/api/remote-jobs?category=software-dev&limit=20';

router.get('/', (req, res, next) => {
  import('node-fetch').then(({ default: fetch }) =>
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        res.status(200).json(data.jobs);
      })
      .catch((err) => console.log(err))
  );
});



router.post('/', (req, res, next) => {
  const apiUrlNew =
  `https://remotive.com/api/remote-jobs?category=${req.body.category}&search=${req.body.title}&limit=20`;
  import('node-fetch').then(({ default: fetch }) =>
    fetch(apiUrlNew)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        res.status(200).json(data.jobs);
      })
      .catch((err) => console.log(err))
  );
});





module.exports = router;
