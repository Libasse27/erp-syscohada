/**
 * Service Écriture Comptable - Gestion des écritures comptables
 */

import api from './api';

const ACCOUNTING_ENTRY_API = '/accounting-entries';

const accountingEntryService = {
  // Obtenir toutes les écritures comptables avec pagination et filtres
  getAll: async (params = {}) => {
    const response = await api.get(ACCOUNTING_ENTRY_API, { params });
    return response.data;
  },

  // Obtenir une écriture comptable par ID
  getById: async (id) => {
    const response = await api.get(`${ACCOUNTING_ENTRY_API}/${id}`);
    return response.data;
  },

  // Créer une nouvelle écriture comptable
  create: async (entryData) => {
    const response = await api.post(ACCOUNTING_ENTRY_API, entryData);
    return response.data;
  },

  // Mettre à jour une écriture comptable
  update: async (id, entryData) => {
    const response = await api.put(`${ACCOUNTING_ENTRY_API}/${id}`, entryData);
    return response.data;
  },

  // Supprimer une écriture comptable
  delete: async (id) => {
    const response = await api.delete(`${ACCOUNTING_ENTRY_API}/${id}`);
    return response.data;
  },

  // Valider une écriture comptable
  validate: async (id) => {
    const response = await api.post(`${ACCOUNTING_ENTRY_API}/${id}/validate`);
    return response.data;
  },

  // Obtenir le grand livre
  getLedger: async (params = {}) => {
    const response = await api.get(`${ACCOUNTING_ENTRY_API}/ledger`, { params });
    return response.data;
  },

  // Obtenir le journal
  getJournal: async (journalType, params = {}) => {
    const response = await api.get(`${ACCOUNTING_ENTRY_API}/journal/${journalType}`, { params });
    return response.data;
  },
};

export default accountingEntryService;
