const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { notFound, errorHandler } = require('./middleware/errors');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : '*'}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/', (req, res) => res.json({ message: 'Personal Finance Tracker API is running.', docs: '/docs' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', require('./routes/authRoutes'));
app.use('/transactions', require('./routes/transactionRoutes'));
app.use('/categories', require('./routes/categoryRoutes'));
app.use('/upload', require('./routes/uploadRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use(notFound);
app.use(errorHandler);

module.exports = app;
