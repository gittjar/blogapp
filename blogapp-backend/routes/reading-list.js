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
      
      // Check if blog is already in reading list
      let existing = await pool.request()
        .input('userId', sql.Int, userId)
        .input('blogId', sql.Int, blogId)
        .query('SELECT id FROM reading_list WHERE user_id = @userId AND blog_id = @blogId');
      
      if (existing.recordset.length > 0) {
        return res.status(409).json({ message: 'Kyseinen blogi on jo lukulistallasi' });
      }
      
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
        .query(`SELECT 
          blogs.*,
          reading_list.is_read,
          FORMAT(blogs.created_at, 'yyyy-MM-dd HH:mm:ss') as formatted_created_at,
          FORMAT(blogs.updated_at, 'yyyy-MM-dd HH:mm:ss') as formatted_updated_at
        FROM reading_list 
        JOIN blogs ON reading_list.blog_id = blogs.id 
        WHERE reading_list.user_id = @userId
        ORDER BY reading_list.id DESC`);
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

// DELETE /api/reading-list/blog/:blogId (remove a blog from reading list by blog ID)
router.delete('/blog/:blogId', getUserFromToken, async (req, res) => {
  const blogId = parseInt(req.params.blogId);
  const userId = req.user.id;

  try {
    let pool = await sql.connect(config);
    
    // Delete the reading list item
    let result = await pool.request()
      .input('userId', sql.Int, userId)
      .input('blogId', sql.Int, blogId)
      .query('DELETE FROM reading_list WHERE user_id = @userId AND blog_id = @blogId');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send('Blog not found in reading list');
    }

    res.status(200).send('Blog removed from reading list successfully!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

// GET /api/reading-list/check (check if blogs are in user's reading list)
router.get('/check', getUserFromToken, async (req, res) => {
  const userId = req.user.id;
  const blogIds = req.query.blogIds; // comma-separated string of blog IDs

  try {
    let pool = await sql.connect(config);
    
    if (!blogIds) {
      return res.json([]);
    }
    
    const blogIdArray = blogIds.split(',').map(id => parseInt(id));
    const placeholders = blogIdArray.map((_, index) => `@blogId${index}`).join(',');
    
    let request = pool.request().input('userId', sql.Int, userId);
    blogIdArray.forEach((id, index) => {
      request.input(`blogId${index}`, sql.Int, id);
    });
    
    let result = await request.query(
      `SELECT blog_id, id as reading_list_id FROM reading_list 
       WHERE user_id = @userId AND blog_id IN (${placeholders})`
    );
    
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

module.exports = router;