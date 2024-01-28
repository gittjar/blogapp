const express = require('express');
const router = express.Router();
const sql = require('mssql');
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');

const config = {
    user: 'kingdat4',
    password: 'SecretPassword2023',
    server: 'stone900.database.windows.net', 
    database: 'GreenlizardDb',
    options: {
        encrypt: true
    }
};

// POST api/users (add a new user)
router.post('/', async (req, res) => {
  const { name, username, password } = req.body;

  // hash the password
  const hashDigest = sha256(password);
  const hashedPassword = Base64.stringify(hmacSHA512(password + hashDigest, password));

  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('name', sql.NVarChar, name)
    .input('username', sql.NVarChar, username)
    .input('password', sql.NVarChar, hashedPassword)
    .query('INSERT INTO users (name, username, password) VALUES (@name, @username, @password)');

  if (result.rowsAffected[0] > 0) {
    res.status(201).send('User added');
  } else {
    res.status(500).send('Error executing query');
  }
});

// GET api/users (list all users)
router.get('/', async (req, res) => {
  let pool = await sql.connect(config);
  let result = await pool.request()
    .query('SELECT users.*, blogs.title as blogs FROM users LEFT JOIN blogs ON users.id = blogs.userid');

  res.json(result.recordset);
});

// PUT api/users/:username (change a username)
router.put('/:username', async (req, res) => {
  const oldUsername = req.params.username;
  const { username } = req.body;

  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('username', sql.NVarChar, username)
    .input('oldUsername', sql.NVarChar, oldUsername)
    .query('UPDATE users SET username = @username WHERE username = @oldUsername');

  if (result.rowsAffected[0] > 0) {
    res.status(200).send(`Username changed from ${oldUsername} to ${username}`);
  } else {
    res.status(500).send('Error executing query');
  }
});

module.exports = router;