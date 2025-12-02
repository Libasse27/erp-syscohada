/**
 * Modèle FiscalYear - Exercices comptables
 * Gestion des exercices fiscaux et périodes comptables
 */

import mongoose from 'mongoose';

const fiscalYearSchema = new mongoose.Schema(
  {
    // Informations de base
    name: {
      type: String,
      required: [true, 'Le nom de l\'exercice est requis'],
      trim: true,
      maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    },
    year: {
      type: Number,
      required: [true, 'L\'année est requise'],
      min: [2000, 'L\'année doit être >= 2000'],
      max: [2100, 'L\'année doit être <= 2100'],
    },

    // Dates de début et fin
    startDate: {
      type: Date,
      required: [true, 'La date de début est requise'],
    },
    endDate: {
      type: Date,
      required: [true, 'La date de fin est requise'],
    },

    // Périodes mensuelles
    periods: [
      {
        month: {
          type: Number,
          min: 1,
          max: 12,
        },
        name: {
          type: String,
          trim: true,
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
        isClosed: {
          type: Boolean,
          default: false,
        },
        closedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        closedAt: {
          type: Date,
        },
      },
    ],

    // Statut
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'archived'],
      default: 'draft',
    },

    // Clôture
    closedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    closedAt: {
      type: Date,
    },

    // Soldes de début d'exercice
    openingBalances: [
      {
        account: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Account',
        },
        debit: {
          type: Number,
          default: 0,
        },
        credit: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Entreprise
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'L\'entreprise est requise'],
    },
  },
  {
    timestamps: true,
  }
);

// Index
fiscalYearSchema.index({ company: 1, year: 1 }, { unique: true });
fiscalYearSchema.index({ status: 1 });
fiscalYearSchema.index({ startDate: 1, endDate: 1 });

// Middleware : Validation des dates
fiscalYearSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error('La date de fin doit être après la date de début'));
  }

  const duration = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24);
  if (duration < 360 || duration > 370) {
    return next(new Error('L\'exercice doit durer environ 12 mois (360-370 jours)'));
  }

  next();
});

// Middleware : Générer les périodes mensuelles si non définies
fiscalYearSchema.pre('save', function (next) {
  if (this.periods.length === 0 && this.startDate && this.endDate) {
    const monthNames = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre',
    ];

    const start = new Date(this.startDate);
    for (let i = 0; i < 12; i++) {
      const periodStart = new Date(start.getFullYear(), start.getMonth() + i, 1);
      const periodEnd = new Date(start.getFullYear(), start.getMonth() + i + 1, 0, 23, 59, 59, 999);

      this.periods.push({
        month: periodStart.getMonth() + 1,
        name: monthNames[periodStart.getMonth()],
        startDate: periodStart,
        endDate: periodEnd,
        isClosed: false,
      });
    }
  }
  next();
});

// Méthode : Ouvrir l'exercice
fiscalYearSchema.methods.open = async function () {
  if (this.status !== 'draft') {
    throw new Error('Seuls les exercices en brouillon peuvent être ouverts');
  }

  this.status = 'open';
  await this.save();
  return this;
};

// Méthode : Clôturer l'exercice
fiscalYearSchema.methods.close = async function (userId) {
  if (this.status !== 'open') {
    throw new Error('Seuls les exercices ouverts peuvent être clôturés');
  }

  // Vérifier que toutes les périodes sont clôturées
  const openPeriods = this.periods.filter((p) => !p.isClosed);
  if (openPeriods.length > 0) {
    throw new Error('Toutes les périodes doivent être clôturées avant de clôturer l\'exercice');
  }

  this.status = 'closed';
  this.closedBy = userId;
  this.closedAt = new Date();
  await this.save();

  return this;
};

// Méthode : Clôturer une période
fiscalYearSchema.methods.closePeriod = async function (month, userId) {
  const period = this.periods.find((p) => p.month === month);
  if (!period) {
    throw new Error('Période non trouvée');
  }

  if (period.isClosed) {
    throw new Error('Cette période est déjà clôturée');
  }

  period.isClosed = true;
  period.closedBy = userId;
  period.closedAt = new Date();
  await this.save();

  return this;
};

// Méthode statique : Obtenir l'exercice actif
fiscalYearSchema.statics.findCurrent = function (companyId) {
  const today = new Date();
  return this.findOne({
    company: companyId,
    status: 'open',
    startDate: { $lte: today },
    endDate: { $gte: today },
  });
};

// Méthode statique : Obtenir la période actuelle
fiscalYearSchema.statics.findCurrentPeriod = async function (companyId) {
  const fiscalYear = await this.findCurrent(companyId);
  if (!fiscalYear) return null;

  const today = new Date();
  const period = fiscalYear.periods.find(
    (p) => p.startDate <= today && p.endDate >= today
  );

  return period ? { fiscalYear, period } : null;
};

const FiscalYear = mongoose.model('FiscalYear', fiscalYearSchema);

export default FiscalYear;
