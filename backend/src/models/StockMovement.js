/**
 * Modèle StockMovement - Mouvements de stock
 * Traçabilité des entrées et sorties de stock
 */

import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema(
  {
    // Type de mouvement
    type: {
      type: String,
      enum: [
        'in',              // Entrée
        'out',             // Sortie
        'transfer',        // Transfert
        'adjustment',      // Ajustement
        'return',          // Retour
        'loss',            // Perte
        'production',      // Production
      ],
      required: [true, 'Le type de mouvement est requis'],
    },

    // Produit
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Le produit est requis'],
    },

    // Quantité
    quantity: {
      type: Number,
      required: [true, 'La quantité est requise'],
      min: [0.01, 'La quantité doit être positive'],
    },
    unit: {
      type: String,
      default: 'unit',
    },

    // Stock avant et après
    stockBefore: {
      type: Number,
      required: true,
    },
    stockAfter: {
      type: Number,
      required: true,
    },

    // Entrepôt source et destination
    warehouseFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
    },
    warehouseTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
    },

    // Coût unitaire
    unitCost: {
      type: Number,
      default: 0,
      min: [0, 'Le coût ne peut pas être négatif'],
    },
    totalCost: {
      type: Number,
      default: 0,
    },

    // Référence du document source
    reference: {
      type: String,
      trim: true,
    },
    referenceType: {
      type: String,
      enum: ['invoice', 'purchase_order', 'transfer', 'adjustment', 'other'],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Date du mouvement
    movementDate: {
      type: Date,
      required: [true, 'La date du mouvement est requise'],
      default: Date.now,
    },

    // Raison et notes
    reason: {
      type: String,
      trim: true,
      maxlength: [200, 'La raison ne peut pas dépasser 200 caractères'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, 'Les notes ne peuvent pas dépasser 500 caractères'],
    },

    // Entreprise et utilisateur
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'L\'entreprise est requise'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est requis'],
    },
  },
  {
    timestamps: true,
  }
);

// Index
stockMovementSchema.index({ product: 1, movementDate: -1 });
stockMovementSchema.index({ company: 1, movementDate: -1 });
stockMovementSchema.index({ type: 1 });
stockMovementSchema.index({ warehouseFrom: 1 });
stockMovementSchema.index({ warehouseTo: 1 });
stockMovementSchema.index({ referenceType: 1, referenceId: 1 });

// Middleware : Calculer le coût total
stockMovementSchema.pre('save', function (next) {
  this.totalCost = this.quantity * this.unitCost;
  next();
});

// Méthode statique : Obtenir l'historique d'un produit
stockMovementSchema.statics.getProductHistory = function (productId, limit = 50) {
  return this.find({ product: productId })
    .sort({ movementDate: -1 })
    .limit(limit)
    .populate('createdBy', 'firstName lastName')
    .populate('warehouseFrom', 'name code')
    .populate('warehouseTo', 'name code');
};

// Méthode statique : Calculer le stock théorique
stockMovementSchema.statics.calculateStock = async function (productId, warehouseId = null) {
  const matchQuery = { product: new mongoose.Types.ObjectId(productId) };

  if (warehouseId) {
    matchQuery.$or = [
      { warehouseTo: new mongoose.Types.ObjectId(warehouseId) },
      { warehouseFrom: new mongoose.Types.ObjectId(warehouseId) },
    ];
  }

  const movements = await this.find(matchQuery).sort({ movementDate: 1 });

  let stock = 0;
  movements.forEach((movement) => {
    if (movement.type === 'in' || movement.warehouseTo?.toString() === warehouseId) {
      stock += movement.quantity;
    } else if (movement.type === 'out' || movement.warehouseFrom?.toString() === warehouseId) {
      stock -= movement.quantity;
    }
  });

  return stock;
};

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

export default StockMovement;
