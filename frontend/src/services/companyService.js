/**
 * Service Entreprise - Gestion des informations de l'entreprise
 */

import api from './api';

const COMPANY_API = '/company';

const companyService = {
  // Obtenir les informations de l'entreprise
  get: async () => {
    const response = await api.get(COMPANY_API);
    return response.data;
  },

  // Mettre à jour les informations de l'entreprise
  update: async (companyData) => {
    const response = await api.put(COMPANY_API, companyData);
    return response.data;
  },

  // Mettre à jour le logo de l'entreprise
  updateLogo: async (logoFile) => {
    const formData = new FormData();
    formData.append('logo', logoFile);
    const response = await api.post(`${COMPANY_API}/logo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer le logo de l'entreprise
  deleteLogo: async () => {
    const response = await api.delete(`${COMPANY_API}/logo`);
    return response.data;
  },

  // Obtenir les paramètres comptables
  getAccountingSettings: async () => {
    const response = await api.get(`${COMPANY_API}/accounting-settings`);
    return response.data;
  },

  // Mettre à jour les paramètres comptables
  updateAccountingSettings: async (settings) => {
    const response = await api.put(`${COMPANY_API}/accounting-settings`, settings);
    return response.data;
  },
};

export default companyService;
