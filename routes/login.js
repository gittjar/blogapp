// routes/login.js
const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');
const router = require('express').Router();
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'kingdat4',
    host: 'stone900.database.windows.net',
    database: 'GreenlizardDb', 
    password: 'SecretPassword2023',
    port: 1433, 
  });

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Fetch the user from the database
  const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
  const user = rows[0];

  // Check if the password is correct
const hashDigest = sha256(password);
const hashedPassword = Base64.stringify(hmacSHA512(password + hashDigest, password));
const passwordCorrect = user === null
  ? false
  : user.password === hashedPassword;

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    });
  }

  // Create a token
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  const token = jwt.sign(userForToken, process.env.SECRET);

  res.status(200).send({ token, username: user.username });
});

module.exports = router;