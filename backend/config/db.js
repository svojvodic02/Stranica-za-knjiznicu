const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'forum'
});
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1); 
  }
  console.log('Connected to MySQL database');
  connection.release();
});

module.exports = pool.promise();