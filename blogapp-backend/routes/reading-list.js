const express = require('express');
const router = express.Router();
const getUserFromToken = require('../middleware/getUserFromToken');
const sql = require('mssql');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const config = {
    user: 'kingdat4',
    password: 'SecretPassword2023',
    server: 'stone900.database.windows.net',
    database: 'GreenlizardDb',
    options: {
        encrypt: true
    }
};

// POST /api/reading-list (add a blog to the reading list)
router.post('/', getUserFromToken, async (req, res) => {
    const { blogId } = req.body;
    const userId = req.user.id;
  
    try {
      let pool = await sql.connect(config);
      await pool.request()
        .input('userId', sql.Int, userId)
        .input('blogId', sql.Int, blogId)
        .query('INSERT INTO reading_list (user_id, blog_id) VALUES (@userId, @blogId)');
      res.status(201).send('Blog added to reading list');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });
  
  // GET /api/reading-list (get the user's reading list)
  router.get('/', getUserFromToken, async (req, res) => {
    const userId = req.user.id;
  
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT blogs.* FROM reading_list JOIN blogs ON reading_list.blog_id = blogs.id WHERE reading_list.user_id = @userId');
      res.json(result.recordset);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });
  
// PUT /api/reading-list/:id (mark a blog as read)
router.put('/:id', getUserFromToken, async (req, res) => {
  const readingListId = req.params.id;
  const { read } = req.body;

  // Get user id from the middleware
  const userId = req.user.id;

  try {
    let pool = await sql.connect(config);

    // Check if the reading list item belongs to the user
    let readingListItem = await pool.request()
      .input('readingListId', sql.Int, readingListId)
      .query('SELECT user_id FROM reading_list WHERE id = @readingListId');

    if (readingListItem.recordset.length === 0) {
      return res.status(404).send('Reading list item not found');
    }

    if (readingListItem.recordset[0].user_id !== userId) {
      return res.status(403).send('You can only mark the blogs in your own reading list as read');
    }

    // Update the reading list item
    await pool.request()
      .input('readingListId', sql.Int, readingListId)
      .input('read', sql.Bit, read)
      .query('UPDATE reading_list SET is_read = @read WHERE id = @readingListId');

    res.status(200).send('Blog marked successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

// DELETE /api/reading-list/:id (remove a blog from the reading list)
router.delete('/:id', getUserFromToken, async (req, res) => {
  const readingListId = req.params.id;

  // Get user id from the middleware
  const userId = req.user.id;

  try {
    let pool = await sql.connect(config);

    // Check if the reading list item belongs to the user
    let readingListItem = await pool.request()
      .input('readingListId', sql.Int, readingListId)
      .query('SELECT user_id FROM reading_list WHERE id = @readingListId');

    if (readingListItem.recordset.length === 0) {
      return res.status(404).send('Reading list item not found');
    }

    if (readingListItem.recordset[0].user_id !== userId) {
      return res.status(403).send('You can only remove the blogs from your own reading list');
    }

    // Delete the reading list item
    await pool.request()
      .input('readingListId', sql.Int, readingListId)
      .query('DELETE FROM reading_list WHERE id = @readingListId');

    res.status(200).send('Blog removed from reading list successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

module.exports = router;