// PDF Export Utilities
// Uses jsPDF library for PDF generation

/**
 * Generate invoice PDF
 * @param {Object} invoice - Invoice data
 * @param {Object} company - Company information
 * @returns {Blob} - PDF blob
 */
export const generateInvoicePDF = async (invoice, company) => {
  // This is a placeholder for PDF generation
  // In production, you would use jsPDF or similar library

  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Company Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name || 'Entreprise', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (company.address) doc.text(company.address, 20, yPosition);
  yPosition += 5;
  if (company.phone) doc.text(`Tél: ${company.phone}`, 20, yPosition);
  yPosition += 5;
  if (company.email) doc.text(`Email: ${company.email}`, 20, yPosition);
  yPosition += 15;

  // Invoice Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const invoiceTitle = invoice.type === 'vente' ? 'FACTURE' : 'FACTURE D\'ACHAT';
  doc.text(invoiceTitle, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Invoice Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`N° ${invoice.number || 'N/A'}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 5;
  doc.text(`Date: ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, pageWidth - 20, yPosition, {
    align: 'right',
  });
  yPosition += 5;
  if (invoice.dueDate) {
    doc.text(
      `Échéance: ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`,
      pageWidth - 20,
      yPosition,
      { align: 'right' }
    );
  }
  yPosition += 15;

  // Customer/Supplier Info
  doc.setFont('helvetica', 'bold');
  const clientLabel = invoice.type === 'vente' ? 'Client:' : 'Fournisseur:';
  doc.text(clientLabel, 20, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'normal');
  const partner = invoice.customer || invoice.supplier || {};
  doc.text(partner.name || 'N/A', 20, yPosition);
  yPosition += 5;
  if (partner.address) doc.text(partner.address, 20, yPosition);
  yPosition += 5;
  if (partner.phone) doc.text(`Tél: ${partner.phone}`, 20, yPosition);
  yPosition += 15;

  // Items Table
  const tableData = (invoice.items || []).map((item) => [
    item.description || item.product?.name || 'N/A',
    item.quantity || 0,
    `${(item.unitPrice || 0).toLocaleString('fr-FR')} FCFA`,
    `${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('fr-FR')} FCFA`,
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Désignation', 'Quantité', 'Prix unitaire', 'Montant']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 9 },
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Totals
  const totalsX = pageWidth - 70;
  doc.setFont('helvetica', 'normal');

  if (invoice.subtotal) {
    doc.text('Sous-total:', totalsX, yPosition);
    doc.text(`${invoice.subtotal.toLocaleString('fr-FR')} FCFA`, pageWidth - 20, yPosition, {
      align: 'right',
    });
    yPosition += 6;
  }

  if (invoice.discount && invoice.discount > 0) {
    doc.text(`Remise (${invoice.discountRate || 0}%):`, totalsX, yPosition);
    doc.text(`-${invoice.discount.toLocaleString('fr-FR')} FCFA`, pageWidth - 20, yPosition, {
      align: 'right',
    });
    yPosition += 6;
  }

  if (invoice.tax && invoice.tax > 0) {
    doc.text(`TVA (${invoice.taxRate || 0}%):`, totalsX, yPosition);
    doc.text(`${invoice.tax.toLocaleString('fr-FR')} FCFA`, pageWidth - 20, yPosition, {
      align: 'right',
    });
    yPosition += 6;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total:', totalsX, yPosition);
  doc.text(`${(invoice.total || 0).toLocaleString('fr-FR')} FCFA`, pageWidth - 20, yPosition, {
    align: 'right',
  });

  // Notes
  if (invoice.notes) {
    yPosition += 15;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Notes:', 20, yPosition);
    yPosition += 5;
    doc.text(invoice.notes, 20, yPosition, { maxWidth: pageWidth - 40 });
  }

  return doc.output('blob');
};

/**
 * Generate purchase order PDF
 * @param {Object} order - Purchase order data
 * @param {Object} company - Company information
 * @returns {Blob} - PDF blob
 */
export const generatePurchaseOrderPDF = async (order, company) => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Company Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name || 'Entreprise', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  if (company.address) doc.text(company.address, 20, yPosition);
  yPosition += 15;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('BON DE COMMANDE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Order details and table similar to invoice...
  doc.text(`N° ${order.number || 'N/A'}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date(order.date).toLocaleDateString('fr-FR')}`, 20, yPosition);
  yPosition += 15;

  // Items table
  const tableData = (order.items || []).map((item) => [
    item.product?.name || 'N/A',
    item.quantity || 0,
    `${(item.unitPrice || 0).toLocaleString('fr-FR')} FCFA`,
    `${((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString('fr-FR')} FCFA`,
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Produit', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
  });

  return doc.output('blob');
};

/**
 * Generate balance sheet PDF
 * @param {Object} data - Balance sheet data
 * @param {Object} company - Company information
 * @returns {Blob} - PDF blob
 */
export const generateBalanceSheetPDF = async (data, company) => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BILAN COMPTABLE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(company.name || 'Entreprise', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(
    `Période: ${new Date(data.startDate).toLocaleDateString('fr-FR')} - ${new Date(
      data.endDate
    ).toLocaleDateString('fr-FR')}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 15;

  // Assets and Liabilities tables would go here...

  return doc.output('blob');
};

/**
 * Generate income statement PDF
 * @param {Object} data - Income statement data
 * @param {Object} company - Company information
 * @returns {Blob} - PDF blob
 */
export const generateIncomeStatementPDF = async (data, company) => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPTE DE RÉSULTAT', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(company.name || 'Entreprise', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;
  doc.text(
    `Période: ${new Date(data.startDate).toLocaleDateString('fr-FR')} - ${new Date(
      data.endDate
    ).toLocaleDateString('fr-FR')}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );
  yPosition += 15;

  // Revenue and expenses tables would go here...

  return doc.output('blob');
};

/**
 * Generic export data to PDF
 * @param {Array} data - Array of data to export
 * @param {Array} columns - Column definitions
 * @param {string} title - Document title
 * @param {string} filename - Filename without extension
 * @param {Object} company - Company information (optional)
 */
export const exportToPDF = async (data, columns, title, filename = 'export', company = {}) => {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Company Header (if provided)
  if (company.name) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(company.name, 20, yPosition);
    yPosition += 10;
  }

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  // Date
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;

  // Prepare table data
  const headers = columns.map(col => col.header || col.label || col);
  const tableData = data.map(row => {
    return columns.map(col => {
      const key = col.accessor || col.key || col;
      const value = typeof key === 'function' ? key(row) : row[key];
      return value != null ? String(value) : '';
    });
  });

  // Generate table
  doc.autoTable({
    startY: yPosition,
    head: [headers],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 8 },
  });

  // Download
  doc.save(`${filename}.pdf`);
};

/**
 * Download PDF blob
 * @param {Blob} blob - PDF blob
 * @param {string} filename - Filename
 */
export const downloadPDF = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Print PDF blob
 * @param {Blob} blob - PDF blob
 */
export const printPDF = (blob) => {
  const url = window.URL.createObjectURL(blob);
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = url;
  document.body.appendChild(iframe);

  iframe.onload = () => {
    iframe.contentWindow.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
      window.URL.revokeObjectURL(url);
    }, 1000);
  };
};
