// ==============================================================================
//        CONFIGURATION DE L'APPLICATION EXPRESS
//
// Ce fichier configure l'application Express avec :
// - Les middlewares de sécurité (Helmet, CORS)
// - Les middlewares de parsing (JSON, URL-encoded, cookies)
// - La compression des réponses
// - Le logging HTTP
// - Les routes de l'API
// - La gestion des erreurs
// ==============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './src/middlewares/errorMiddleware.js';
import logger from './src/utils/logger.js';

// Import des routes
import routes from './src/routes/index.js';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();

// --- 1. Middlewares de sécurité ---
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// --- 2. Middlewares de parsing ---
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// --- 3. Compression des réponses ---
app.use(compression());

// --- 4. Logging HTTP ---
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// --- 5. Route de santé (health check) ---
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur ERP SYSCOHADA opérationnel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    pid: process.pid
  });
});

// --- 6. Routes API ---
app.use('/api', routes);

// --- 7. Route 404 - Not Found ---
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// --- 8. Middleware de gestion des erreurs (doit être en dernier) ---
app.use(errorHandler);

export default app;
