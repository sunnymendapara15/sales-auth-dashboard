const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { validateEmail, sanitizeString } = require('../utils/validators');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '2h';
const userProjection = 'id, name, email, role, created_at';

const createToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

router.post('/signup', (req, res) => {
  const name = sanitizeString(req.body.name);
  const email = sanitizeString(req.body.email).toLowerCase();
  const password = (req.body.password || '').trim();

  if (!name || !validateEmail(email) || password.length < 7) {
    return res.status(400).json({
      status: 'error',
      message: 'Provide a name, a valid email, and a password with at least 7 characters.',
    });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(400).json({
      status: 'error',
      message: 'A user with that email already exists.',
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const insert = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const info = insert.run(name, email, hashedPassword);
  const user = db.prepare(`SELECT ${userProjection} FROM users WHERE id = ?`).get(info.lastInsertRowid);

  res.status(201).json({
    user,
    token: createToken({ id: user.id, email: user.email }),
  });
});

router.post('/login', (req, res) => {
  const email = sanitizeString(req.body.email).toLowerCase();
  const password = (req.body.password || '').trim();

  if (!validateEmail(email) || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and password are required.',
    });
  }

  const userRow = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!userRow) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
  }

  const passwordMatches = bcrypt.compareSync(password, userRow.password);
  if (!passwordMatches) {
    return res.status(401).json({ status: 'error', message: 'Invalid credentials.' });
  }

  const user = {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    created_at: userRow.created_at,
  };

  res.json({
    user,
    token: createToken({ id: user.id, email: user.email }),
  });
});

module.exports = router;
