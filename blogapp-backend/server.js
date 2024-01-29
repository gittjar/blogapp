const express = require('express');
const app = express();
const blogsRouter = require('./routes/blogs');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const cors = require('cors');

app.use(express.json());
app.use(cors());

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});