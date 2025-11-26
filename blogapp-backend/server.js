const express = require('express');
const app = express();
const blogsRouter = require('./routes/blogs');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const readingListRouter = require('./routes/reading-list');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/reading-list', readingListRouter);

// Api = root endpoint
app.get('/api/', (req, res) => {
  res.send('Welcome to the Blog App API');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});