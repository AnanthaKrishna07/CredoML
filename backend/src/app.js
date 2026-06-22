const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import our central database connection configuration
const sequelize = require('./config/db');

// Import our parallel models so Sequelize knows they exist before syncing
const User = require('./models/User');
const Applicant = require('./models/Applicant');
const Decision = require('./models/Decision');

// Import our integrated API routes layout
const apiRoutes = require('./routes/api');

const app = express();

// Middleware layout
app.use(cors()); // Allows our Next.js frontend to talk to this backend
app.use(express.json()); // Parses incoming JSON payloads

// Mount all modular endpoints behind the '/api' prefix path
app.use('/api', apiRoutes);

// Simple Health Check Endpoint for the Node backend
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "healthy", service: "node-backend-api" });
});

const PORT = process.env.PORT || 5000;

// Connect to the database and sync structural models
async function startServer() {
  try {
    // Authenticate verifies if the credentials in your .env connect successfully
    await sequelize.authenticate();
    printSuccessLog("Successfully connected to PostgreSQL database.");

    // sync() looks at your User, Applicant, and Decision schemas and handles table creation
    // alter: true updates table columns automatically if you modify them later without dropping data
    await sequelize.sync({ alter: true });
    printSuccessLog("Parallel tables (users, applicants, decisions) synchronized.");

    app.listen(PORT, () => {
      console.log(`\n🚀 NODE_BACKEND TERMINAL ACTIVE: Listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("\n❌ FATAL: Unable to initialize backend service cluster:");
    console.error(error.message);
    process.exit(1); // Destroys the process if a database connection is impossible
  }
}

function printSuccessLog(message) {
  console.log(`--- SUCCESS: ${message} ---`);
}

startServer();