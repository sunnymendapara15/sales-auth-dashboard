const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('tiny'));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Sales auth API listening on port ${port}`);
});
