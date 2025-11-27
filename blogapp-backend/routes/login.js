const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');
const router = require('express').Router();
const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, 
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true
    }
};

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Fetch the user from the database
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM users WHERE username = @username');
    const user = result.recordset[0];

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    let passwordCorrect = false;
    let needsUpgrade = false;

    // Try bcrypt first (new system)
    try {
      passwordCorrect = await bcrypt.compare(password, user.password);
    } catch (err) {
      // If bcrypt fails, try old hashing method
      const hashDigest = sha256(password);
      const hashedPassword = Base64.stringify(hmacSHA512(password + hashDigest, password));
      passwordCorrect = user.password === hashedPassword;
      needsUpgrade = passwordCorrect; // If old method worked, upgrade to bcrypt
    }

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // If user logged in with old hash, upgrade to bcrypt automatically
    if (needsUpgrade) {
      try {
        const newHashedPassword = await bcrypt.hash(password, 10);
        await pool.request()
          .input('userId', sql.Int, user.id)
          .input('newPassword', sql.NVarChar, newHashedPassword)
          .query('UPDATE users SET password = @newPassword WHERE id = @userId');
        console.log(`✅ Upgraded password to bcrypt for user: ${user.username}`);
      } catch (upgradeErr) {
        console.error('Failed to upgrade password:', upgradeErr);
        // Don't fail login if upgrade fails
      }
    }

    // Create a token with 1 day expiration
    const userForToken = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1d' });

    res.status(200).json({ 
      token, 
      username: user.username, 
      id: user.id,
      expiresIn: '1 day'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Error during login' });
  }
});

module.exports = router;