const express = require('express');
const app = express();
const blogsRouter = require('./routes/blogs');
const usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');
const readingListRouter = require('./routes/reading-list');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Rate limiting for login endpoint - prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for user creation - prevent spam
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 account creations per hour
  message: 'Too many accounts created, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiters
app.use('/api/login', loginLimiter);
app.use('/api/users', createAccountLimiter);
app.use('/api/', apiLimiter); // Apply to all API routes

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