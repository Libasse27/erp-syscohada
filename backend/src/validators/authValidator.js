/**
 * Validators pour l'authentification
 * Validation des données avec Joi
 */

import Joi from 'joi';

// Schéma de validation pour l'inscription
export const registerSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le prénom est requis',
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
      'any.required': 'Le prénom est requis',
    }),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères',
      'any.required': 'Le nom est requis',
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': "L'email est requis",
      'string.email': "L'email n'est pas valide",
      'any.required': "L'email est requis",
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Le mot de passe est requis',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères',
      'any.required': 'Le mot de passe est requis',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .optional()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^(\+221|00221)?[0-9]{9}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base':
        'Le numéro de téléphone doit être au format sénégalais (+221XXXXXXXXX)',
    }),

  role: Joi.string()
    .valid('admin', 'accountant', 'sales', 'user')
    .default('user')
    .messages({
      'any.only': 'Le rôle doit être: admin, accountant, sales ou user',
    }),
});

// Schéma de validation pour la connexion
export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': "L'email est requis",
      'string.email': "L'email n'est pas valide",
      'any.required': "L'email est requis",
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le mot de passe est requis',
      'any.required': 'Le mot de passe est requis',
    }),

  rememberMe: Joi.boolean()
    .optional()
    .default(false),
});

// Schéma de validation pour le mot de passe oublié
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required()
    .messages({
      'string.empty': "L'email est requis",
      'string.email': "L'email n'est pas valide",
      'any.required': "L'email est requis",
    }),
});

// Schéma de validation pour la réinitialisation du mot de passe
export const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Le mot de passe est requis',
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'string.max': 'Le mot de passe ne peut pas dépasser 100 caractères',
      'any.required': 'Le mot de passe est requis',
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
      'any.required': 'La confirmation du mot de passe est requise',
    }),

  token: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le token est requis',
      'any.required': 'Le token est requis',
    }),
});

// Schéma de validation pour la mise à jour du profil
export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le prénom doit contenir au moins 2 caractères',
      'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
    }),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères',
    }),

  phone: Joi.string()
    .trim()
    .pattern(/^(\+221|00221)?[0-9]{9}$/)
    .optional()
    .allow('')
    .messages({
      'string.pattern.base':
        'Le numéro de téléphone doit être au format sénégalais (+221XXXXXXXXX)',
    }),

  avatar: Joi.string()
    .uri()
    .optional()
    .allow('')
    .messages({
      'string.uri': "L'URL de l'avatar n'est pas valide",
    }),
});

// Schéma de validation pour le changement de mot de passe
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'string.empty': 'Le mot de passe actuel est requis',
      'any.required': 'Le mot de passe actuel est requis',
    }),

  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Le nouveau mot de passe est requis',
      'string.min': 'Le nouveau mot de passe doit contenir au moins 6 caractères',
      'string.max': 'Le nouveau mot de passe ne peut pas dépasser 100 caractères',
      'any.required': 'Le nouveau mot de passe est requis',
    }),

  confirmNewPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Les mots de passe ne correspondent pas',
      'any.required': 'La confirmation du nouveau mot de passe est requise',
    }),
});
