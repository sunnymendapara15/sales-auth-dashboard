const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const { validateEmail, sanitizeString } = require('../utils/validators');

const router = express.Router();
router.use(authMiddleware);

const projection = 'id, name, email, role, created_at';

router.get('/', (req, res) => {
  const users = db.prepare(`SELECT ${projection} FROM users ORDER BY created_at DESC`).all();
  res.json({ users });
});

router.post('/', (req, res) => {
  const name = sanitizeString(req.body.name);
  const email = sanitizeString(req.body.email).toLowerCase();
  const password = (req.body.password || '').trim();
  const role = sanitizeString(req.body.role) || 'sales';

  if (!name || !validateEmail(email) || password.length < 7) {
    return res.status(400).json({
      status: 'error',
      message: 'Name, valid email, and password (min 7 chars) are required.',
    });
  }

  const duplicate = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (duplicate) {
    return res.status(400).json({ status: 'error', message: 'Another user already uses that email.' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
    .run(name, email, hashed, role);
  const user = db.prepare(`SELECT ${projection} FROM users WHERE id = ?`).get(info.lastInsertRowid);

  res.status(201).json({ user });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ status: 'error', message: 'User id is required.' });
  }

  const stored = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!stored) {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }

  const name = sanitizeString(req.body.name) || stored.name;
  const email = sanitizeString(req.body.email).toLowerCase() || stored.email;
  const role = sanitizeString(req.body.role) || stored.role;
  const password = (req.body.password || '').trim();

  if (!validateEmail(email)) {
    return res.status(400).json({ status: 'error', message: 'Provide a valid email address.' });
  }

  const conflict = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, id);
  if (conflict) {
    return res.status(400).json({ status: 'error', message: 'Email already in use by another account.' });
  }

  const passwordHash = password ? bcrypt.hashSync(password, 10) : stored.password;
  db.prepare('UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?').run(
    name,
    email,
    passwordHash,
    role,
    id
  );

  const updated = db.prepare(`SELECT ${projection} FROM users WHERE id = ?`).get(id);
  res.json({ user: updated });
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ status: 'error', message: 'User id is required.' });
  }

  const info = db.prepare('DELETE FROM users WHERE id = ?').run(id);
  if (!info.changes) {
    return res.status(404).json({ status: 'error', message: 'User not found.' });
  }

  res.status(204).send();
});

module.exports = router;
