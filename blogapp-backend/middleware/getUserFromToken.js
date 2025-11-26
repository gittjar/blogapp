const jwt = require('jsonwebtoken');

const getUserFromToken = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }

  if (!req.token) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  let decodedToken = {};
  try {
    decodedToken = jwt.verify(req.token, process.env.SECRET);
  } catch (err) {
    // Provide specific error messages
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'token expired', 
        message: 'Your session has expired. Please log in again.' 
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'token invalid', 
        message: 'Invalid authentication token. Please log in again.' 
      });
    }
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  req.user = decodedToken;
  next();
};

module.exports = getUserFromToken;