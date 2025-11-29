/**
 * Configuration JWT (JSON Web Token)
 * Gestion des tokens d'authentification
 */

export const jwtConfig = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m'
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
  }
};

/**
 * Options pour les cookies (refresh token)
 */
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours en millisecondes
};
