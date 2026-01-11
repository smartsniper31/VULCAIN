require('module-alias/register');

import express from 'express';
import cors from 'cors';
import { VForgeEngine } from './infrastructure/scrapers/VForgeEngine';
import trendsRoutes from './interfaces/http/routes/trends.routes';

console.log('VULCAIN Trend Intelligence Engine is starting...');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Nettoyage préventif : on enlève le slash final s'il existe
const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const frontendUrl = rawFrontendUrl.replace(/\/$/, '');

// Middleware
const corsOptions = {
  origin: [
    'https://vulcain.onrender.com',
    'http://localhost:3000',
    frontendUrl
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
// On initialise l'instance, mais on ne la lance pas tout de suite pour ne pas bloquer le boot
const forgeEngine = new VForgeEngine();

// Start server
app.listen(PORT, () => {
  console.log(`VULCAIN API server running on port ${PORT}`);
  
  // Lancement du moteur en asynchrone une fois que le serveur est UP
  console.log('🚀 Starting V-Forge Engine in background...');
  try {
    forgeEngine.startAutomatedForge();
  } catch (err: any) {
    console.error('❌ CRITICAL: V-Forge Engine failed to start:', err);
  }
  
  console.log('VULCAIN is now forging trends every 15 minutes...');
});
