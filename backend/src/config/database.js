/**
 * Configuration de la connexion à MongoDB
 */

import mongoose from 'mongoose';
import logger from '../utils/logger.js';

/**
 * Connexion à MongoDB avec Mongoose
 */
export const connectDB = async () => {
  try {
    const mongoURI = process.env.NODE_ENV === 'test'
      ? process.env.MONGODB_TEST_URI
      : process.env.MONGODB_URI;

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(mongoURI, options);

    logger.info(`✅ MongoDB connecté: ${conn.connection.host}`);
    logger.info(`📦 Base de données: ${conn.connection.name}`);

    // Gestion des événements de connexion
    mongoose.connection.on('error', (err) => {
      logger.error(`❌ Erreur MongoDB: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB déconnecté');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('🔄 MongoDB reconnecté');
    });

  } catch (error) {
    logger.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Déconnexion de MongoDB (utile pour les tests)
 */
export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('🔌 MongoDB déconnecté proprement');
  } catch (error) {
    logger.error(`❌ Erreur lors de la déconnexion: ${error.message}`);
    process.exit(1);
  }
};
