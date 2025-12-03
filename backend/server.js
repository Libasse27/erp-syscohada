// ==============================================================================
//        POINT D'ENTRÉE PRINCIPAL DU SERVEUR
//
// Ce fichier orchestre :
// - le démarrage de l'application Express,
// - la connexion aux services externes (MongoDB),
// - l'initialisation de Socket.IO,
// - la gestion des événements système critiques pour un arrêt propre.
// ==============================================================================

// --- 1. Chargement des variables d'environnement ---
import dotenv from 'dotenv';
dotenv.config();

// --- 2. Dépendances ---
import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB, disconnectDB } from './src/config/database.js';
import logger from './src/utils/logger.js';

// --- 3. Configuration ---
const PORT = process.env.PORT || 5000;
const ENV = process.env.NODE_ENV || 'development';

// --- 4. Initialisation de Socket.IO ---
let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST']
    }
  });

  // Gérer les connexions Socket.io
  io.on('connection', (socket) => {
    logger.info(`✅ Nouveau client connecté: ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`❌ Client déconnecté: ${socket.id}`);
    });
  });

  // Rendre io accessible globalement
  app.set('io', io);
  logger.info('✅ Socket.IO initialisé avec succès');

  return io;
}

// --- 5. Fermeture propre (Graceful Shutdown) ---
async function shutdown(serverInstance, code = 0) {
  logger.info('🛑 Fermeture du serveur en cours...');
  try {
    // Fermer Socket.IO
    if (io) {
      io.close(() => {
        logger.info('✅ Socket.IO fermé proprement');
      });
    }

    // Fermer la base de données
    await disconnectDB();

    // Fermer le serveur HTTP
    serverInstance.close(() => {
      logger.info('✅ Serveur arrêté proprement.');
      process.exit(code);
    });

    // Timeout de 10 secondes pour forcer la fermeture
    setTimeout(() => {
      logger.error('⏰ Timeout dépassé, fermeture forcée du serveur');
      process.exit(1);
    }, 10000);
  } catch (err) {
    logger.error('❌ Erreur lors de l\'arrêt du serveur', { error: err.message });
    process.exit(1);
  }
}

// --- 6. Gestion des événements système ---
function setupProcessEventListeners(serverInstance) {
  process.on('unhandledRejection', (reason) => {
    logger.error('💥 Rejet de promesse non géré. L\'application va s\'arrêter.', { reason });
    throw reason;
  });

  process.on('uncaughtException', async (err) => {
    logger.error('💥 Exception non interceptée. Arrêt brutal du serveur...', { error: err.message });
    await shutdown(serverInstance, 1);
  });

  process.on('SIGTERM', async () => {
    logger.warn('⚠️  Signal SIGTERM reçu. Fermeture propre du serveur...');
    await shutdown(serverInstance, 0);
  });

  process.on('SIGINT', async () => {
    logger.warn('⚠️  Signal SIGINT (Ctrl+C) reçu. Fermeture propre du serveur...');
    await shutdown(serverInstance, 0);
  });
}

// --- 7. Démarrage du serveur ---
async function startServer() {
  logger.info('====================================================');
  logger.info('🚀 Lancement du serveur ERP SYSCOHADA...');
  logger.info(`🔧 Environnement : ${ENV}`);
  logger.info('====================================================');

  try {
    // Connexion à la base de données
    await connectDB();

    // Création du serveur HTTP
    const server = createServer(app);

    // Initialisation de Socket.IO
    initSocket(server);

    // Gestion des erreurs du serveur
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(`❌ Le port ${PORT} est déjà utilisé`);
        logger.error('💡 Veuillez libérer le port ou utiliser un autre port');
        process.exit(1);
      } else {
        logger.error('❌ Erreur du serveur HTTP', { error: err.message });
        process.exit(1);
      }
    });

    // Lancement du serveur
    const serverInstance = server.listen(PORT, () => {
      logger.info('====================================================');
      logger.info('✅ Serveur en ligne !');
      logger.info(`🌍 Port         : ${PORT}`);
      logger.info(`🧬 PID          : ${process.pid}`);
      logger.info(`🔗 URL          : http://localhost:${PORT}`);
      logger.info(`🏥 Health Check : http://localhost:${PORT}/health`);
      logger.info('====================================================');
    });

    // Écoute des événements critiques (crash, Ctrl+C...)
    setupProcessEventListeners(serverInstance);

  } catch (error) {
    logger.error('❌ Échec critique du démarrage du serveur', { error: error.message });
    process.exit(1);
  }
}

// --- 8. Lancer ---
startServer();
