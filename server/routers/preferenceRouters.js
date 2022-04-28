const express = require('express');
const router = express.Router();
const db = require('../models/userSqlModel');

const listPreferences = {
  softwaredev: 4,
  customersupport:5 ,
  design: 6,
  marketing:7 ,
  sales: 8,
  product:9 ,
  business:10 ,
  data: 11,
  devops: 12,
  financelegal: 13,
  hr: 14,
  qa: 15,
  writing: 16,
  allothers: 17
}


router.post('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  const preferences = req.body;
  const preferencesArr = [];
  console.log('preferences: ', preferences);
  preferencesArr.push(userId);
  
  for (const key in preferences){
    if (listPreferences[key]){
      preferencesArr.push(listPreferences[key]);
    }
  }

  console.log('preferencesArr: ', preferencesArr);
  function createQueryStr(NumPreferences){
    let str = 'INSERT INTO user_preferences (user_id, preference_id) VALUES ';
    for (let i = 2; i <= NumPreferences; i++){
      str += `($1, $${i})`;
      if (i < NumPreferences) str += ',';
    }
    str += ';'
    return str;
  }
  try {
  const userPreference = await db.query(createQueryStr(preferencesArr.length), preferencesArr);
  res.locals.preferences =  userPreference;
  return res.status(200).json(res.locals.preferences);
  } catch (err) {
    return next({
      log: `Error occurred when trying to add preferences ${err}`,
      message: { err: 'Could not add preferences' },
    });
  }

});

router.get('/:userId', async (req, res, next) => {
  const { userId } = req.params;
  try {
    const userPreference = await db.query(`SELECT preferences.name FROM users 
    JOIN user_preferences ON users.id = user_preferences.user_id
    JOIN preferences ON preferences.id = user_preferences.preference_id
    WHERE users.id = $1;
    `, [userId])
    res.locals.preferences = userPreference;
    return res.status(200).json(res.locals.preferences);
  } catch (err) {
    return next({
      log: `Error occurred when trying to get preferences ${err}`,
      message: { err: 'Could not find preferences' },
    });
  }
});

module.exports = router;