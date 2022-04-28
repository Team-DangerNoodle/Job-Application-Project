const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

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
  const { title, category } = req.body;
  console.log('hit here');
  console.log('title', title);
  console.log('category', category);
  title = title.replaceAll(' ', '%20');
  const newApiUrl = `https://remotive.com/api/remote-jobs?category=${category}&search=${title}&limit=20`;
  import('node-fetch').then(({ default: fetch }) =>
    //use req.body to construct apiUrl
    fetch(newApiUrl)
      .then((res) => res.json())
      .then((data) => {
        res.status(200).json(data.jobs);
      })
      .catch((err) => console.log(err))
  );
});

module.exports = router;
