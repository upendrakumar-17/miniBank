require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const accountRoutes = require('./routes/accountRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Use Routes
app.use('/api/accounts', accountRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));