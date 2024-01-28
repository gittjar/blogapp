// routes/blogs.js
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

// GET api/blogs (list all blogs)
router.get('/', async (req, res) => {
  const search = req.query.search;
  let query = 'SELECT blogs.*, users.username FROM blogs JOIN users ON blogs.userid = users.id';
  let params = [];

  if (search) {
    query += ' WHERE title LIKE @search OR author LIKE @search';
    params.push({name: 'search', value: `%${search}%`}); // Add the search parameter wrapped in % signs for a substring match
  }

  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error executing query');
  }
});

 // POST api/blogs (add a new blog)
router.post('/', getUserFromToken, async (req, res) => {
    const { author, title, likes, url } = req.body;
    const userId = req.user.id; // Get user id from request
  
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('author', sql.NVarChar, author)
        .input('title', sql.NVarChar, title)
        .input('likes', sql.Int, likes)
        .input('url', sql.NVarChar, url)
        .input('userId', sql.Int, userId)
        .query('INSERT INTO blogs (author, title, likes, url, userid) VALUES (@author, @title, @likes, @url, @userId)');
      res.status(201).send('Blog added');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });
  
  // PUT api/blogs/:id (modify the like count of a blog)
  router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const { likes } = req.body;
  
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('likes', sql.Int, likes)
        .input('id', sql.Int, id)
        .query('UPDATE blogs SET likes = @likes WHERE id = @id');
      res.status(200).send(`Blog modified with ID: ${id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });
  
  // DELETE api/blogs/:id (delete a blog)
  router.delete('/:id', getUserFromToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Get user id from request
  
    try {
      let pool = await sql.connect(config);
      let result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT userid FROM blogs WHERE id = @id');
  
      if (result.recordset[0].userid !== userId) {
        res.status(403).send('You are not authorized to delete this blog');
      } else {
        await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM blogs WHERE id = @id');
        res.send('Blog deleted');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error executing query');
    }
  });

module.exports = router;