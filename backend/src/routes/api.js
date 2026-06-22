const express = require('express');
const router = express.Router();

// Import controllers
const authController = require('../controllers/authController');
const riskController = require('../controllers/riskController');

// Import our brand new security guard middleware
const protect = require('../middleware/auth');

// --- Public Authentication Routes ---
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);

// --- Shielded Risk Management Routes (Protected by Middleware) ---
router.post('/risk/evaluate', protect, riskController.evaluateRisk);
router.get('/risk/audit-logs', protect, riskController.getAuditLogs);

module.exports = router;