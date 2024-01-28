// routes/users.js

const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');

const pool = new Pool({
    user: 'kingdat4',
    host: 'stone900.database.windows.net',
    database: 'GreenlizardDb', 
    password: 'SecretPassword2023',
    port: 1433, 
  });

// POST api/users (add a new user)
router.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  // hash the password
  const hashDigest = sha256(password);
  const hashedPassword = Base64.stringify(hmacSHA512(password + hashDigest, password));

  pool.query('INSERT INTO users (name, username, password) VALUES ($1, $2, $3)', [name, username, hashedPassword], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    } else {
      res.status(201).send('User added');
    }
  });
});
  
  // GET api/users (list all users)
  router.get('/', (req, res) => {
    pool.query('SELECT users.*, array_agg(blogs.title) as blogs FROM users LEFT JOIN blogs ON users.id = blogs.userid GROUP BY users.id', (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error executing query');
      } else {
        res.json(result.rows);
      }
    });
  });
  
  // PUT api/users/:username (change a username)
  router.put('/:username', (req, res) => {
    const oldUsername = req.params.username;
    const { username } = req.body;
    pool.query('UPDATE users SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2', [username, oldUsername], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error executing query');
      } else {
        res.status(200).send(`Username changed from ${oldUsername} to ${username}`);
      }
    });
  });




module.exports = router;