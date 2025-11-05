const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const SECRET = process.env.JWT_SECRET || 'verysecretkey';

// Middleware
app.use(cors());
app.use(express.json());

// Paths to data files
const USERS_PATH = path.join(__dirname, 'data', 'users.json');
const COURSES_PATH = path.join(__dirname, 'data', 'courses.json');

// Load data from disk
function loadUsers() {
  try {
    const raw = fs.readFileSync(USERS_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2));
}

function loadCourses() {
  try {
    const raw = fs.readFileSync(COURSES_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

// In-memory data
let users = loadUsers();
const courses = loadCourses();

// Helper to generate JWT token
function generateToken(user) {
  return jwt.sign({ id: user.id }, SECRET, { expiresIn: '7d' });
}

// Authentication middleware
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const user = users.find((u) => u.id === payload.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Register endpoint
app.post('/api/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !password || (!email && !phone)) {
    return res.status(400).json({ message: 'Name, password and either email or phone are required' });
  }
  const existing = users.find((u) => u.email === email || u.phone === phone);
  if (existing) {
    return res.status(409).json({ message: 'User already exists' });
  }
  const hashed = bcrypt.hashSync(password, 8);
  const newUser = {
    id: users.length + 1,
    name,
    email: email || null,
    phone: phone || null,
    password: hashed
  };
  users.push(newUser);
  saveUsers(users);
  const token = generateToken(newUser);
  return res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone } });
});

// Login endpoint supporting password or OTP
app.post('/api/login', (req, res) => {
  const { email, phone, password, otp } = req.body;
  if ((!email && !phone) || (!password && !otp)) {
    return res.status(400).json({ message: 'Missing credentials' });
  }
  const user = users.find((u) => u.email === email || u.phone === phone);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // If OTP is provided, verify it (for demo purposes we use static code)
  if (otp) {
    if (otp !== '123456') {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
  } else {
    // Verify password
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
  }
  const token = generateToken(user);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

// Endpoint to get current user details
app.get('/api/me', authenticate, (req, res) => {
  const { id, name, email, phone } = req.user;
  return res.json({ user: { id, name, email, phone } });
});

// Endpoint to fetch all courses grouped by category
app.get('/api/courses', (req, res) => {
  return res.json({ courses });
});

// Endpoint to get courses by category key (e.g. special, liveRecorded, etc.)
app.get('/api/courses/:category', (req, res) => {
  const key = req.params.category;
  const list = courses[key];
  if (!list) {
    return res.status(404).json({ message: 'Category not found' });
  }
  return res.json({ items: list });
});

// Endpoint to fetch live classes (dummy data)
app.get('/api/live', (req, res) => {
  const liveClasses = [
    { id: 1, title: 'Live Physics Class', startTime: '2025-11-01T10:00:00Z', description: 'Join the live physics class and solve problems together.' },
    { id: 2, title: 'Chemistry Q&A Session', startTime: '2025-11-02T15:00:00Z', description: 'Ask your doubts in our live chemistry Q&A session.' }
  ];
  return res.json({ items: liveClasses });
});

// Endpoint to fetch downloads for the authenticated user (placeholder)
app.get('/api/downloads', authenticate, (req, res) => {
  // In a real application, downloads would be stored per user. Here we return a static list.
  const downloads = [
    { id: 1, title: 'Physics Formula Handbook', type: 'pdf' },
    { id: 2, title: 'All India Test Series - Paper 1', type: 'test' }
  ];
  return res.json({ items: downloads });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});