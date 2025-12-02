/**
 * Modèle PurchaseOrder - Bons de commande
 * Gestion des commandes d'achat auprès des fournisseurs
 */

import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0.01, 'La quantité doit être positive'],
  },
  quantityReceived: {
    type: Number,
    default: 0,
    min: [0, 'La quantité reçue ne peut pas être négative'],
  },
  unit: {
    type: String,
    default: 'unit',
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Le prix ne peut pas être négatif'],
  },
  total: {
    type: Number,
    required: true,
  },
});

const purchaseOrderSchema = new mongoose.Schema(
  {
    // Numérotation
    number: {
      type: String,
      required: [true, 'Le numéro de commande est requis'],
      trim: true,
      uppercase: true,
    },

    // Fournisseur
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: [true, 'Le fournisseur est requis'],
    },

    // Dates
    orderDate: {
      type: Date,
      required: [true, 'La date de commande est requise'],
      default: Date.now,
    },
    expectedDate: {
      type: Date,
    },
    receivedDate: {
      type: Date,
    },

    // Lignes de commande
    items: [orderItemSchema],

    // Montants
    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    vatRate: {
      type: Number,
      default: 18,
    },
    vatAmount: {
      type: Number,
      default: 0,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      enum: ['XOF', 'EUR', 'USD', 'XAF'],
      default: 'XOF',
    },

    // Statut
    status: {
      type: String,
      enum: ['draft', 'sent', 'confirmed', 'partial', 'received', 'cancelled'],
      default: 'draft',
    },

    // Livraison
    shippingAddress: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      postalCode: { type: String, trim: true },
      country: { type: String, default: 'Sénégal' },
    },

    // Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères'],
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
    },
  },
  {
    timestamps: true,
  }
);

// Index
purchaseOrderSchema.index({ company: 1, number: 1 }, { unique: true });
purchaseOrderSchema.index({ supplier: 1 });
purchaseOrderSchema.index({ status: 1 });
purchaseOrderSchema.index({ orderDate: -1 });

// Middleware : Calculer les totaux
purchaseOrderSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((sum, item) => {
    item.total = item.quantity * item.unitPrice;
    return sum + item.total;
  }, 0);

  this.vatAmount = (this.subtotal * this.vatRate) / 100;
  this.total = this.subtotal + this.vatAmount + this.shippingCost;

  next();
});

// Méthode : Enregistrer une réception partielle
purchaseOrderSchema.methods.receiveItems = async function (itemsReceived) {
  itemsReceived.forEach(({ productId, quantity }) => {
    const item = this.items.find((i) => i.product.toString() === productId);
    if (item) {
      item.quantityReceived += quantity;
    }
  });

  const allReceived = this.items.every((item) => item.quantityReceived >= item.quantity);
  const someReceived = this.items.some((item) => item.quantityReceived > 0);

  if (allReceived) {
    this.status = 'received';
    this.receivedDate = new Date();
  } else if (someReceived) {
    this.status = 'partial';
  }

  await this.save();
  return this;
};

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
