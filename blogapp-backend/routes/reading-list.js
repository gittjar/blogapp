const express = require('express');
const router = express.Router();
const getUserFromToken = require('../middleware/getUserFromToken');
const sql = require('mssql');

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
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      let pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, id)
        .input('userId', sql.Int, userId)
        .query('UPDATE reading_list SET is_read = 1 WHERE id = @id AND user_id = @userId');
      res.status(200).send('Blog marked as read');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });

module.exports = router;