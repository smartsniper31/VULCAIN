require('module-alias/register');

import express from 'express';
import cors from 'cors';
import { VForgeEngine } from './infrastructure/scrapers/VForgeEngine';
import trendsRoutes from './interfaces/http/routes/trends.routes';

console.log('VULCAIN Trend Intelligence Engine is starting...');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
const corsOptions = {
  origin: [
    'https://vulcain.onrender.com',
    'http://localhost:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json());

// Routes
app.use('/api', trendsRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'VULCAIN Online', message: 'Forge is active' });
});

// Initialize and start the V-Forge Engine
const forgeEngine = new VForgeEngine();
forgeEngine.startAutomatedForge();

// Start server
app.listen(PORT, () => {
  console.log(`VULCAIN API server running on port ${PORT}`);
  console.log('VULCAIN is now forging trends every 15 minutes...');
});
