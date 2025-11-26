const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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

    // Check if the password is correct using bcrypt
    const passwordCorrect = await bcrypt.compare(password, user.password);

    if (!passwordCorrect) {
      return res.status(401).json({ error: 'Invalid username or password' });
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