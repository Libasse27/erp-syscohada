/**
 * ERP SYSCOHADA - Serveur Backend
 * Application de gestion commerciale et comptabilité pour PME sénégalaises
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import { errorHandler } from './src/middlewares/errorMiddleware.js';
import logger from './src/utils/logger.js';

// Import des routes
import routes from './src/routes/index.js';

// Chargement des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données MongoDB
connectDB();

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression des réponses
app.use(compression());

// Logging HTTP
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

// Route de santé (health check)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Serveur ERP SYSCOHADA opérationnel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Routes API
app.use('/api', routes);

// Route 404 - Not Found
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

// Démarrage du serveur
const server = app.listen(PORT, () => {
  logger.info(
    `✅ Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`
  );
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = Number(PORT) + 1;
    logger.warn(`Le port ${PORT} est déjà utilisé, tentative sur le port ${newPort}`);
    app.listen(newPort, () => {
      logger.info(
        `✅ Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${newPort}`
      );
    });
  } else {
    logger.error(err);
  }
});

process.on('unhandledRejection', (err, promise) => {
  logger.error(`❌ ERREUR: ${err.message}`);
  // Fermer le serveur et quitter le processus
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  logger.error('❌ UNCAUGHT EXCEPTION! Arrêt du serveur...');
  logger.error(err);
  process.exit(1);
});

export default app;

