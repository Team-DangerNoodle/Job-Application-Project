const { Pool } = require('pg');

const PG_URI = 'postgres://cpxyyyrd:IHxsqBG9QCkl101tijFSkw29hGfbCNkB@isilo.db.elephantsql.com/cpxyyyrd';

const pool = new Pool({
  connectionString: PG_URI,
});

module.exports = {
  query: (text, params, callback) => {
    console.log('executed query', text);
    return pool.query(text, params, callback);
  },
};