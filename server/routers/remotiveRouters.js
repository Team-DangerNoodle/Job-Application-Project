const express = require('express');
const router = express.Router();
// const fetch = require('node-fetch');

const apiUrl =
  "https://remotive.com/api/remote-jobs?category=software-dev&limit=20";

router.get('/', (req, res, next) => {
  import('node-fetch').then(({ default: fetch }) =>
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        res.status(200).json(data.jobs);
      })
      .catch((err) => console.log(err))
  );
});

module.exports = router;
