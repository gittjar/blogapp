const express = require('express');
const router = express.Router();
const sql = require('mssql');
const sha256 = require('crypto-js/sha256');
const hmacSHA512 = require('crypto-js/hmac-sha512');
const Base64 = require('crypto-js/enc-base64');
const getUserFromToken = require('../middleware/getUserFromToken');
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


// GET /api/users/:id (get the user's information along with the reading list)
router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    let pool = await sql.connect(config);
    let userResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT name, username, created_at FROM users WHERE id = @userId');
    
    let readingListResult = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT blogs.*, reading_list.id AS readingListId, reading_list.is_read AS [read]
        FROM reading_list 
        JOIN blogs ON reading_list.blog_id = blogs.id 
        WHERE reading_list.user_id = @userId
      `);
    
    if (userResult.recordset.length > 0) {
      let user = userResult.recordset[0];
      user.readings = readingListResult.recordset.map(blog => ({
        ...blog,
        readinglists: [{
          read: blog.read,
          id: blog.readingListId
        }]
      }));

      res.json(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

// GET /api/users/:id?read=true or /api/users/:id?read=false (get the user's reading list)
router.get('/:id', getUserFromToken, async (req, res) => {
  const userId = req.params.id;

  // Get the 'read' query parameter
  const read = req.query.read;

  try {
    let pool = await sql.connect(config);

    // Build the query
    let query = 'SELECT * FROM reading_list WHERE user_id = @userId';
    if (read !== undefined) {
      query += ' AND is_read = @read';
    }

    // Execute the query
    let result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('read', sql.Bit, read === 'true')
      .query(query);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

module.exports = router;