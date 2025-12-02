// Excel Export Utilities
// Uses xlsx library for Excel generation

/**
 * Export data to Excel
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename without extension
 * @param {string} sheetName - Sheet name
 */
export const exportToExcel = async (data, filename = 'export', sheetName = 'Sheet1') => {
  const XLSX = await import('xlsx');

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate and download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export invoices to Excel
 * @param {Array} invoices - Invoices data
 * @param {string} filename - Filename
 */
export const exportInvoicesToExcel = async (invoices, filename = 'factures') => {
  const data = invoices.map((invoice) => ({
    'N° Facture': invoice.number,
    Date: new Date(invoice.date).toLocaleDateString('fr-FR'),
    Client: invoice.customer?.name || invoice.supplier?.name || 'N/A',
    'Montant HT': invoice.subtotal || 0,
    TVA: invoice.tax || 0,
    'Montant TTC': invoice.total || 0,
    Statut: invoice.status,
  }));

  await exportToExcel(data, filename, 'Factures');
};

/**
 * Export products to Excel
 * @param {Array} products - Products data
 * @param {string} filename - Filename
 */
export const exportProductsToExcel = async (products, filename = 'produits') => {
  const data = products.map((product) => ({
    Référence: product.reference || 'N/A',
    Nom: product.name,
    Catégorie: product.category?.name || 'N/A',
    'Prix d\'achat': product.purchasePrice || 0,
    'Prix de vente': product.sellingPrice || 0,
    Stock: product.stock || 0,
    'Stock minimum': product.minStock || 0,
    Unité: product.unit || 'pièce',
  }));

  await exportToExcel(data, filename, 'Produits');
};

/**
 * Export customers to Excel
 * @param {Array} customers - Customers data
 * @param {string} filename - Filename
 */
export const exportCustomersToExcel = async (customers, filename = 'clients') => {
  const data = customers.map((customer) => ({
    Nom: customer.name,
    Email: customer.email || 'N/A',
    Téléphone: customer.phone || 'N/A',
    Adresse: customer.address || 'N/A',
    Ville: customer.city || 'N/A',
    Type: customer.type || 'N/A',
    'Date de création': new Date(customer.createdAt).toLocaleDateString('fr-FR'),
  }));

  await exportToExcel(data, filename, 'Clients');
};

/**
 * Export suppliers to Excel
 * @param {Array} suppliers - Suppliers data
 * @param {string} filename - Filename
 */
export const exportSuppliersToExcel = async (suppliers, filename = 'fournisseurs') => {
  const data = suppliers.map((supplier) => ({
    Nom: supplier.name,
    Email: supplier.email || 'N/A',
    Téléphone: supplier.phone || 'N/A',
    Adresse: supplier.address || 'N/A',
    Ville: supplier.city || 'N/A',
    'Date de création': new Date(supplier.createdAt).toLocaleDateString('fr-FR'),
  }));

  await exportToExcel(data, filename, 'Fournisseurs');
};

/**
 * Export payments to Excel
 * @param {Array} payments - Payments data
 * @param {string} filename - Filename
 */
export const exportPaymentsToExcel = async (payments, filename = 'paiements') => {
  const data = payments.map((payment) => ({
    Date: new Date(payment.date).toLocaleDateString('fr-FR'),
    'N° Facture': payment.invoice?.number || 'N/A',
    Client: payment.invoice?.customer?.name || 'N/A',
    Montant: payment.amount || 0,
    Méthode: payment.method,
    Statut: payment.status,
    Référence: payment.reference || 'N/A',
  }));

  await exportToExcel(data, filename, 'Paiements');
};

/**
 * Export stock movements to Excel
 * @param {Array} movements - Stock movements data
 * @param {string} filename - Filename
 */
export const exportStockMovementsToExcel = async (movements, filename = 'mouvements_stock') => {
  const data = movements.map((movement) => ({
    Date: new Date(movement.date).toLocaleDateString('fr-FR'),
    Produit: movement.product?.name || 'N/A',
    Type: movement.type,
    Quantité: movement.quantity,
    'Stock avant': movement.previousStock || 0,
    'Stock après': movement.newStock || 0,
    Référence: movement.reference || 'N/A',
    Motif: movement.reason || 'N/A',
  }));

  await exportToExcel(data, filename, 'Mouvements de stock');
};

/**
 * Export accounting entries to Excel
 * @param {Array} entries - Accounting entries data
 * @param {string} filename - Filename
 */
export const exportAccountingEntriesToExcel = async (entries, filename = 'ecritures_comptables') => {
  const data = [];

  entries.forEach((entry) => {
    entry.lines?.forEach((line) => {
      data.push({
        Date: new Date(entry.date).toLocaleDateString('fr-FR'),
        Journal: entry.journal?.name || 'N/A',
        'N° Pièce': entry.reference || 'N/A',
        Compte: line.account?.code || 'N/A',
        'Libellé compte': line.account?.name || 'N/A',
        Libellé: line.description || entry.description || 'N/A',
        Débit: line.debit || 0,
        Crédit: line.credit || 0,
      });
    });
  });

  await exportToExcel(data, filename, 'Écritures comptables');
};

/**
 * Export sales report to Excel
 * @param {Object} report - Sales report data
 * @param {string} filename - Filename
 */
export const exportSalesReportToExcel = async (report, filename = 'rapport_ventes') => {
  const XLSX = await import('xlsx');

  const workbook = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ['Rapport des ventes'],
    [''],
    ['Période', `${report.startDate} - ${report.endDate}`],
    [''],
    ['Total des ventes', report.totalSales || 0],
    ['Nombre de factures', report.invoiceCount || 0],
    ['Montant moyen', report.averageAmount || 0],
    ['Marge totale', report.totalMargin || 0],
    ['Taux de marge', `${report.marginRate || 0}%`],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Résumé');

  // Details sheet
  if (report.details && report.details.length > 0) {
    const detailsData = report.details.map((item) => ({
      Date: new Date(item.date).toLocaleDateString('fr-FR'),
      'N° Facture': item.number,
      Client: item.customer,
      Montant: item.amount,
      Marge: item.margin,
    }));

    const detailsSheet = XLSX.utils.json_to_sheet(detailsData);
    XLSX.utils.book_append_sheet(workbook, detailsSheet, 'Détails');
  }

  // By product sheet
  if (report.byProduct && report.byProduct.length > 0) {
    const productsData = report.byProduct.map((item) => ({
      Produit: item.product,
      Quantité: item.quantity,
      'Montant total': item.total,
      'Montant moyen': item.average,
    }));

    const productsSheet = XLSX.utils.json_to_sheet(productsData);
    XLSX.utils.book_append_sheet(workbook, productsSheet, 'Par produit');
  }

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export balance sheet to Excel
 * @param {Object} balanceSheet - Balance sheet data
 * @param {string} filename - Filename
 */
export const exportBalanceSheetToExcel = async (balanceSheet, filename = 'bilan') => {
  const XLSX = await import('xlsx');

  const workbook = XLSX.utils.book_new();

  // Assets sheet
  const assetsData = (balanceSheet.assets || []).map((item) => ({
    Compte: item.account,
    Libellé: item.label,
    Montant: item.amount,
  }));
  assetsData.push({ Compte: '', Libellé: 'TOTAL ACTIF', Montant: balanceSheet.totalAssets || 0 });

  const assetsSheet = XLSX.utils.json_to_sheet(assetsData);
  XLSX.utils.book_append_sheet(workbook, assetsSheet, 'Actif');

  // Liabilities sheet
  const liabilitiesData = (balanceSheet.liabilities || []).map((item) => ({
    Compte: item.account,
    Libellé: item.label,
    Montant: item.amount,
  }));
  liabilitiesData.push({
    Compte: '',
    Libellé: 'TOTAL PASSIF',
    Montant: balanceSheet.totalLiabilities || 0,
  });

  const liabilitiesSheet = XLSX.utils.json_to_sheet(liabilitiesData);
  XLSX.utils.book_append_sheet(workbook, liabilitiesSheet, 'Passif');

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Export multiple sheets to Excel
 * @param {Object} sheetsData - Object with sheet names as keys and data arrays as values
 * @param {string} filename - Filename
 */
export const exportMultipleSheetsToExcel = async (sheetsData, filename = 'export') => {
  const XLSX = await import('xlsx');

  const workbook = XLSX.utils.book_new();

  Object.entries(sheetsData).forEach(([sheetName, data]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  });

  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

/**
 * Import data from Excel file
 * @param {File} file - Excel file
 * @returns {Promise<Object>} - Object with sheet names as keys and data arrays as values
 */
export const importFromExcel = async (file) => {
  const XLSX = await import('xlsx');

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const result = {};
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
        });

        resolve(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};
