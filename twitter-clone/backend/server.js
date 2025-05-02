const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory data storage
let users = [];
let tweets = [];
let follows = [];

// Helper functions
function generateToken(user) {
  return jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Routes

// Signup
app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }
  users.push({ username, password });
  res.status(201).json({ message: 'User created' });
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = generateToken(user);
  res.json({ token });
});

// Post a tweet
app.post('/tweets', authenticateToken, (req, res) => {
  const { content } = req.body;
  if (!content || content.length === 0 || content.length > 280) {
    return res.status(400).json({ message: 'Tweet content must be between 1 and 280 characters' });
  }
  const tweet = {
    id: tweets.length + 1,
    username: req.user.username,
    content,
    timestamp: new Date()
  };
  tweets.unshift(tweet);
  res.status(201).json(tweet);
});

// Get timeline tweets (tweets from user and followed users)
app.get('/timeline', authenticateToken, (req, res) => {
  const username = req.user.username;
  const following = follows.filter(f => f.follower === username).map(f => f.following);
  const timelineTweets = tweets.filter(t => t.username === username || following.includes(t.username));
  res.json(timelineTweets);
});

// Follow a user
app.post('/follow', authenticateToken, (req, res) => {
  const follower = req.user.username;
  const { following } = req.body;
  if (follower === following) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }
  if (!users.find(u => u.username === following)) {
    return res.status(404).json({ message: 'User to follow not found' });
  }
  if (follows.find(f => f.follower === follower && f.following === following)) {
    return res.status(400).json({ message: 'Already following this user' });
  }
  follows.push({ follower, following });
  res.json({ message: `Now following ${following}` });
});

// Unfollow a user
app.post('/unfollow', authenticateToken, (req, res) => {
  const follower = req.user.username;
  const { following } = req.body;
  const index = follows.findIndex(f => f.follower === follower && f.following === following);
  if (index === -1) {
    return res.status(400).json({ message: 'Not following this user' });
  }
  follows.splice(index, 1);
  res.json({ message: `Unfollowed ${following}` });
});

// Get user profile info
app.get('/profile/:username', authenticateToken, (req, res) => {
  const { username } = req.params;
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const userTweets = tweets.filter(t => t.username === username);
  const followersCount = follows.filter(f => f.following === username).length;
  const followingCount = follows.filter(f => f.follower === username).length;
  res.json({
    username,
    tweets: userTweets,
    followersCount,
    followingCount
  });
});

app.listen(PORT, () => {
  console.log(`Backend API server running on http://localhost:${PORT}`);
});
