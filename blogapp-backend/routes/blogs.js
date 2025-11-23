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
  let query = `SELECT 
    blogs.*, 
    users.username,
    FORMAT(blogs.created_at, 'yyyy-MM-dd HH:mm:ss') as formatted_created_at,
    FORMAT(blogs.updated_at, 'yyyy-MM-dd HH:mm:ss') as formatted_updated_at
  FROM blogs 
  JOIN users ON blogs.userid = users.id`;
  
  let params = [];

  if (search) {
    query += ' WHERE title LIKE @search OR author LIKE @search OR category LIKE @search';
    params.push({name: 'search', value: `%${search}%`});
  }

  query += ' ORDER BY blogs.created_at DESC';

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

// GET api/blogs/:id (get a single blog)
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  
  console.log(`📖 Blog ${id} requested - incrementing view count`);
  
  try {
    let pool = await sql.connect(config);
    
    // Increment view count
    let updateResult = await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE blogs SET views = ISNULL(views, 0) + 1 WHERE id = @id');
    
    console.log(`✅ View count updated. Rows affected: ${updateResult.rowsAffected[0]}`);
    
    // Get the blog with updated view count
    let result = await pool.request()
      .input('id', sql.Int, id)
      .query(`SELECT 
        blogs.*, 
        users.username,
        FORMAT(blogs.created_at, 'yyyy-MM-dd HH:mm:ss') as formatted_created_at,
        FORMAT(blogs.updated_at, 'yyyy-MM-dd HH:mm:ss') as formatted_updated_at
      FROM blogs 
      JOIN users ON blogs.userid = users.id
      WHERE blogs.id = @id`);
    
    if (result.recordset.length === 0) {
      return res.status(404).send('Blog not found');
    }
    
    console.log(`📊 Blog ${id} now has ${result.recordset[0].views} views`);
    
    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching blog:', err);
    res.status(500).send('Error executing query');
  }
});

 // POST api/blogs (add a new blog)
router.post('/', getUserFromToken, async (req, res) => {
    const { author, title, likes, url, description, content, image_url, category } = req.body;
    const userId = req.user.id; // Get user id from request
  
    console.log('Attempting to create blog with data:', { author, title, likes, url, description, content, image_url, category, userId });
  
    try {
      let pool = await sql.connect(config);
      
      // Build dynamic query based on which fields exist in database
      let columns = ['author', 'title', 'likes', 'url', 'userid'];
      let values = ['@author', '@title', '@likes', '@url', '@userId'];
      let request = pool.request()
        .input('author', sql.NVarChar, author)
        .input('title', sql.NVarChar, title)
        .input('likes', sql.Int, likes || 0)
        .input('url', sql.NVarChar, url || '')
        .input('userId', sql.Int, userId);
      
      // Add optional new columns only if they're provided
      if (description !== undefined) {
        columns.push('description');
        values.push('@description');
        request.input('description', sql.NVarChar, description);
      }
      if (content !== undefined) {
        columns.push('content');
        values.push('@content');
        request.input('content', sql.NVarChar, content);
      }
      if (image_url !== undefined) {
        columns.push('image_url');
        values.push('@image_url');
        request.input('image_url', sql.NVarChar, image_url);
      }
      if (category !== undefined) {
        columns.push('category');
        values.push('@category');
        request.input('category', sql.NVarChar, category);
      }
      
      const query = `INSERT INTO blogs (${columns.join(', ')}) VALUES (${values.join(', ')})`;
      console.log('Executing query:', query);
      
      let result = await request.query(query);
      res.status(201).send('Blog added');
    } catch (err) {
      console.error('Database error:', err);
      console.error('Error message:', err.message);
      res.status(500).send(`Error executing query: ${err.message}`);
    }
  });
  
  // PUT api/blogs/:id (modify a blog)
  router.put('/:id', getUserFromToken, async (req, res) => {
    const id = parseInt(req.params.id);
    const { likes, author, title, description, content, url, image_url, category } = req.body;
    const userId = req.user.id;
  
    try {
      let pool = await sql.connect(config);
      
      // Check if user owns the blog (for content updates) or just updating likes
      if (author || title || description || content || url || image_url || category) {
        let ownerCheck = await pool.request()
          .input('id', sql.Int, id)
          .query('SELECT userid FROM blogs WHERE id = @id');
        
        if (ownerCheck.recordset.length === 0) {
          return res.status(404).send('Blog not found');
        }
        
        if (ownerCheck.recordset[0].userid !== userId) {
          return res.status(403).send('You are not authorized to modify this blog');
        }
      }
      
      // Build dynamic update query
      let updateFields = [];
      let request = pool.request();
      
      if (likes !== undefined) {
        updateFields.push('likes = @likes');
        request.input('likes', sql.Int, likes);
      }
      if (author) {
        updateFields.push('author = @author');
        request.input('author', sql.NVarChar, author);
      }
      if (title) {
        updateFields.push('title = @title');
        request.input('title', sql.NVarChar, title);
      }
      if (description !== undefined) {
        updateFields.push('description = @description');
        request.input('description', sql.NVarChar, description);
      }
      if (content !== undefined) {
        updateFields.push('content = @content');
        request.input('content', sql.NVarChar, content);
      }
      if (url !== undefined) {
        updateFields.push('url = @url');
        request.input('url', sql.NVarChar, url);
      }
      if (image_url !== undefined) {
        updateFields.push('image_url = @image_url');
        request.input('image_url', sql.NVarChar, image_url);
      }
      if (category !== undefined) {
        updateFields.push('category = @category');
        request.input('category', sql.NVarChar, category);
      }
      
      updateFields.push('updated_at = SYSDATETIME()');
      request.input('id', sql.Int, id);
      
      let query = `UPDATE blogs SET ${updateFields.join(', ')} WHERE id = @id`;
      
      await request.query(query);
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