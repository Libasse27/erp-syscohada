import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Select, Alert } from '../../components/common';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import balanceSheetService from '../../services/balanceSheetService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * Balance Sheet Page (Bilan)
 * Displays SYSCOHADA balance sheet with assets, liabilities and equity
 */
const BalanceSheet = () => {
  const dispatch = useDispatch();
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('year');
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Rapports', path: '/dashboard/reports' },
      { label: 'Bilan' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadBalanceSheet();
  }, [period, compareMode]);

  const loadBalanceSheet = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { period, compareMode };
      const response = await balanceSheetService.getBalanceSheet(params);
      setBalanceData(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du bilan');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!balanceData) return;
    exportToPDF(
      [balanceData],
      `bilan-${formatDate(new Date())}`,
      'Bilan SYSCOHADA'
    );
  };

  const handleExportExcel = () => {
    if (!balanceData) return;
    exportToExcel(
      [balanceData],
      `bilan-${formatDate(new Date())}`
    );
  };

  const renderBalanceSection = (title, items, isAsset = true) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 border-b-2 border-gray-300 dark:border-gray-600 pb-2">
          {title}
        </h3>
        {items.map((item, index) => (
          <div key={index} className="mb-1">
            {item.isSubtotal ? (
              <div className="flex justify-between font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded">
                <span>{item.label}</span>
                <span>{formatCurrency(item.amount)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-sm py-1 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded">
                <span className={`${item.isTotal ? 'font-bold' : ''} text-gray-700 dark:text-gray-300`}>
                  {item.indent && <span className="mr-2">"</span>}
                  {item.label}
                </span>
                <span className={`${item.isTotal ? 'font-bold' : ''} text-gray-900 dark:text-white`}>
                  {formatCurrency(item.amount)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bilan SYSCOHADA
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            État de la situation financière
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={loading || !balanceData}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={loading || !balanceData}
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
              <option value="quarter">Ce trimestre</option>
              <option value="year">Cette année</option>
              <option value="custom">Personnalisée</option>
            </Select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={compareMode}
                onChange={(e) => setCompareMode(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Comparer avec période précédente
              </span>
            </label>
          </div>
        </div>
      </Card>

      {balanceData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Actif</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(balanceData.totalAssets || 0)}
              </p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Passif</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(balanceData.totalLiabilities || 0)}
              </p>
            </Card>
            <Card className="bg-green-50 dark:bg-green-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Capitaux propres</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(balanceData.totalEquity || 0)}
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="ACTIF">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : (
                <div>
                  {renderBalanceSection(
                    'ACTIF IMMOBILISÉ',
                    balanceData.fixedAssets
                  )}
                  {renderBalanceSection(
                    'ACTIF CIRCULANT',
                    balanceData.currentAssets
                  )}
                  {renderBalanceSection(
                    'TRÉSORERIE ACTIF',
                    balanceData.cashAssets
                  )}

                  <div className="mt-6 pt-4 border-t-4 border-blue-500">
                    <div className="flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400">
                      <span>TOTAL ACTIF</span>
                      <span>{formatCurrency(balanceData.totalAssets || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card title="PASSIF">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : (
                <div>
                  {renderBalanceSection(
                    'CAPITAUX PROPRES',
                    balanceData.equity,
                    false
                  )}
                  {renderBalanceSection(
                    'DETTES FINANCIÈRES',
                    balanceData.longTermLiabilities,
                    false
                  )}
                  {renderBalanceSection(
                    'PASSIF CIRCULANT',
                    balanceData.currentLiabilities,
                    false
                  )}
                  {renderBalanceSection(
                    'TRÉSORERIE PASSIF',
                    balanceData.cashLiabilities,
                    false
                  )}

                  <div className="mt-6 pt-4 border-t-4 border-red-500">
                    <div className="flex justify-between text-xl font-bold text-red-600 dark:text-red-400">
                      <span>TOTAL PASSIF</span>
                      <span>{formatCurrency((balanceData.totalLiabilities || 0) + (balanceData.totalEquity || 0))}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Ratios financiers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Ratio de liquidité générale
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {balanceData.ratios?.currentRatio?.toFixed(2) || '0.00'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Actif circulant / Passif circulant
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Ratio d&apos;endettement
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {balanceData.ratios?.debtRatio?.toFixed(2) || '0.00'}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Dettes / Total actif
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Ratio d&apos;autonomie financière
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {balanceData.ratios?.equityRatio?.toFixed(2) || '0.00'}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Capitaux propres / Total passif
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default BalanceSheet;
