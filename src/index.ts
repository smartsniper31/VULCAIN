require('module-alias/register');

import express from 'express';
import { VForgeEngine } from './infrastructure/scrapers/VForgeEngine';
import trendsRoutes from './interfaces/http/routes/trends.routes';

console.log('VULCAIN Trend Intelligence Engine is starting...');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api', trendsRoutes);

// Initialize and start the V-Forge Engine
const forgeEngine = new VForgeEngine();
forgeEngine.startAutomatedForge();

// Start server
app.listen(PORT, () => {
  console.log(`VULCAIN API server running on port ${PORT}`);
  console.log('VULCAIN is now forging trends every 15 minutes...');
});
