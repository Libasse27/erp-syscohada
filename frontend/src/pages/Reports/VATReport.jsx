import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Select, Alert } from '../../components/common';
import { DataTable } from '../../components/tables';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import vatReportService from '../../services/vatReportService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * VAT Report Page
 * Displays VAT declaration report (TVA collectée et déductible)
 */
const VATReport = () => {
  const dispatch = useDispatch();
  const [vatData, setVatData] = useState(null);
  const [vatDetails, setVatDetails] = useState({ sales: [], purchases: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('month');
  const [viewType, setViewType] = useState('summary');

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Rapports', path: '/dashboard/reports' },
      { label: 'Rapport TVA' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadVATReport();
  }, [period]);

  const loadVATReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { period };
      const response = await vatReportService.getVATReport(params);
      setVatData(response.data.summary);
      setVatDetails({
        sales: response.data.sales || [],
        purchases: response.data.purchases || [],
      });
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du rapport TVA');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!vatData) return;
    const dataToExport = {
      ...vatData,
      sales: vatDetails.sales,
      purchases: vatDetails.purchases,
    };
    exportToPDF(
      [dataToExport],
      `rapport-tva-${formatDate(new Date())}`,
      'Déclaration de TVA'
    );
  };

  const handleExportExcel = () => {
    if (!vatData) return;
    const dataToExport = viewType === 'sales' ? vatDetails.sales : vatDetails.purchases;
    exportToExcel(
      dataToExport,
      `rapport-tva-${viewType}-${formatDate(new Date())}`
    );
  };

  const salesColumns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      header: 'Référence',
      accessor: 'reference',
      width: '140px',
      render: (row) => (
        <span className="font-mono text-sm text-gray-900 dark:text-white">
          {row.reference}
        </span>
      ),
    },
    {
      header: 'Client',
      accessor: 'customerName',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.customerName}</span>
      ),
    },
    {
      header: 'Base HT',
      accessor: 'baseAmount',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.baseAmount)}
        </span>
      ),
    },
    {
      header: 'Taux',
      accessor: 'vatRate',
      width: '80px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.vatRate}%
        </span>
      ),
    },
    {
      header: 'TVA collectée',
      accessor: 'vatAmount',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-green-600 dark:text-green-400">
          {formatCurrency(row.vatAmount)}
        </span>
      ),
    },
  ];

  const purchasesColumns = [
    {
      header: 'Date',
      accessor: 'date',
      width: '120px',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(row.date)}
        </span>
      ),
    },
    {
      header: 'Référence',
      accessor: 'reference',
      width: '140px',
      render: (row) => (
        <span className="font-mono text-sm text-gray-900 dark:text-white">
          {row.reference}
        </span>
      ),
    },
    {
      header: 'Fournisseur',
      accessor: 'supplierName',
      render: (row) => (
        <span className="text-gray-900 dark:text-white">{row.supplierName}</span>
      ),
    },
    {
      header: 'Base HT',
      accessor: 'baseAmount',
      width: '120px',
      render: (row) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {formatCurrency(row.baseAmount)}
        </span>
      ),
    },
    {
      header: 'Taux',
      accessor: 'vatRate',
      width: '80px',
      cellClassName: 'text-center',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.vatRate}%
        </span>
      ),
    },
    {
      header: 'TVA déductible',
      accessor: 'vatAmount',
      width: '140px',
      render: (row) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {formatCurrency(row.vatAmount)}
        </span>
      ),
    },
  ];

  const vatToPay = (vatData?.collectedVAT || 0) - (vatData?.deductibleVAT || 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Déclaration de TVA
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            TVA collectée, déductible et à payer
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={loading || !vatData}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={loading || !vatData}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            PDF
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Période</label>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="month">Ce mois</option>
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisée</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Affichage</label>
            <Select value={viewType} onChange={(e) => setViewType(e.target.value)}>
              <option value="summary">Synthèse</option>
              <option value="sales">Détail TVA collectée</option>
              <option value="purchases">Détail TVA déductible</option>
            </Select>
          </div>
        </div>
      </Card>

      {vatData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50 dark:bg-green-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">TVA collectée</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(vatData.collectedVAT || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sur ventes de {formatCurrency(vatData.salesBaseAmount || 0)}
              </p>
            </Card>
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">TVA déductible</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(vatData.deductibleVAT || 0)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sur achats de {formatCurrency(vatData.purchasesBaseAmount || 0)}
              </p>
            </Card>
            <Card className={`${vatToPay >= 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-purple-50 dark:bg-purple-900/30'}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {vatToPay >= 0 ? 'TVA à payer' : 'Crédit de TVA'}
              </p>
              <p className={`text-2xl font-bold ${vatToPay >= 0 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                {formatCurrency(Math.abs(vatToPay))}
              </p>
              {vatToPay >= 0 && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                    À régler avant la date limite
                </p>
              )}
            </Card>
          </div>

          {viewType === 'summary' && (
            <Card title="Récapitulatif de la déclaration">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    I. TVA Collectée (sur ventes)
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Base HT des ventes
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(vatData.salesBaseAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Nombre de factures
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {vatData.salesCount || 0}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Total TVA collectée
                        </span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(vatData.collectedVAT || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    II. TVA Déductible (sur achats)
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Base HT des achats
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(vatData.purchasesBaseAmount || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Nombre de factures
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {vatData.purchasesCount || 0}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Total TVA déductible
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(vatData.deductibleVAT || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    III. Calcul de la TVA nette
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">TVA collectée</span>
                      <span className="text-gray-900 dark:text-white">
                        {formatCurrency(vatData.collectedVAT || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">TVA déductible</span>
                      <span className="text-gray-900 dark:text-white">
                        - {formatCurrency(vatData.deductibleVAT || 0)}
                      </span>
                    </div>
                    <div className="border-t-2 border-gray-400 dark:border-gray-500 pt-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          {vatToPay >= 0 ? 'TVA à payer' : 'Crédit de TVA'}
                        </span>
                        <span className={`text-2xl font-bold ${vatToPay >= 0 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                          {formatCurrency(Math.abs(vatToPay))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {viewType === 'sales' && (
            <Card title="Détail de la TVA collectée">
              <DataTable
                columns={salesColumns}
                data={vatDetails.sales}
                loading={loading}
                emptyMessage="Aucune facture de vente"
              />
            </Card>
          )}

          {viewType === 'purchases' && (
            <Card title="Détail de la TVA déductible">
              <DataTable
                columns={purchasesColumns}
                data={vatDetails.purchases}
                loading={loading}
                emptyMessage="Aucune facture d'achat"
              />
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default VATReport;
