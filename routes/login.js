const jwt = require('jsonwebtoken');
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');
const router = require('express').Router();
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: 'kingdat4',
    password: 'SecretPassword2023',
    server: 'stone900.database.windows.net', 
    database: 'GreenlizardDb',
    options: {
        encrypt: true
    }
};

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Fetch the user from the database
  let pool = await sql.connect(config);
  let result = await pool.request()
    .input('username', sql.NVarChar, username)
    .query('SELECT * FROM users WHERE username = @username');
  const user = result.recordset[0];

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