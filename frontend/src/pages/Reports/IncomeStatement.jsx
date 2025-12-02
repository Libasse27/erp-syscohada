import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button, Select, Alert } from '../../components/common';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import incomeStatementService from '../../services/incomeStatementService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { exportToPDF, exportToExcel } from '../../utils';

/**
 * Income Statement Page (Compte de résultat)
 * Displays SYSCOHADA income statement with revenues, expenses and net income
 */
const IncomeStatement = () => {
  const dispatch = useDispatch();
  const [incomeData, setIncomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('year');
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Rapports', path: '/dashboard/reports' },
      { label: 'Compte de résultat' }
    ]));
  }, [dispatch]);

  useEffect(() => {
    loadIncomeStatement();
  }, [period, compareMode]);

  const loadIncomeStatement = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = { period, compareMode };
      const response = await incomeStatementService.getIncomeStatement(params);
      setIncomeData(response.data);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du compte de résultat');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!incomeData) return;
    exportToPDF(
      [incomeData],
      `compte-resultat-${formatDate(new Date())}`,
      'Compte de Résultat SYSCOHADA'
    );
  };

  const handleExportExcel = () => {
    if (!incomeData) return;
    exportToExcel(
      [incomeData],
      `compte-resultat-${formatDate(new Date())}`
    );
  };

  const renderIncomeSection = (items) => {
    if (!items || items.length === 0) return null;

    return items.map((item, index) => (
      <div key={index} className="mb-1">
        {item.isSubtotal ? (
          <div className="flex justify-between font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 p-2 rounded mt-2">
            <span>{item.label}</span>
            <span className={item.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {formatCurrency(item.amount)}
            </span>
          </div>
        ) : item.isTotal ? (
          <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 p-3 rounded mt-3">
            <span>{item.label}</span>
            <span className={item.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
              {formatCurrency(item.amount)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between text-sm py-1 hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded">
            <span className="text-gray-700 dark:text-gray-300">
              {item.indent && <span className="mr-2">"</span>}
              {item.label}
            </span>
            <span className="text-gray-900 dark:text-white">
              {formatCurrency(item.amount)}
            </span>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Compte de résultat SYSCOHADA
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Analyse des produits et charges
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={loading || !incomeData}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={loading || !incomeData}
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

      {incomeData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-50 dark:bg-green-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Produits</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(incomeData.totalRevenue || 0)}
              </p>
            </Card>
            <Card className="bg-red-50 dark:bg-red-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Charges</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(incomeData.totalExpenses || 0)}
              </p>
            </Card>
            <Card className={`${(incomeData.netIncome || 0) >= 0 ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-orange-50 dark:bg-orange-900/30'}`}>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Résultat net</p>
              <p className={`text-2xl font-bold ${(incomeData.netIncome || 0) >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {formatCurrency(incomeData.netIncome || 0)}
              </p>
            </Card>
            <Card className="bg-purple-50 dark:bg-purple-900/30">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Marge nette</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {incomeData.netMargin?.toFixed(1) || '0.0'}%
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="PRODUITS (Classe 7)">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : (
                <div>
                  {renderIncomeSection(incomeData.revenues)}

                  <div className="mt-6 pt-4 border-t-4 border-green-500">
                    <div className="flex justify-between text-xl font-bold text-green-600 dark:text-green-400">
                      <span>TOTAL PRODUITS</span>
                      <span>{formatCurrency(incomeData.totalRevenue || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card title="CHARGES (Classe 6)">
              {loading ? (
                <div className="text-center py-8 text-gray-500">Chargement...</div>
              ) : (
                <div>
                  {renderIncomeSection(incomeData.expenses)}

                  <div className="mt-6 pt-4 border-t-4 border-red-500">
                    <div className="flex justify-between text-xl font-bold text-red-600 dark:text-red-400">
                      <span>TOTAL CHARGES</span>
                      <span>{formatCurrency(incomeData.totalExpenses || 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <Card>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b-2 border-gray-300 dark:border-gray-600 pb-2">
                RÉSULTATS INTERMÉDIAIRES
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Chiffre d&apos;affaires</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(incomeData.salesRevenue || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Coût des ventes</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(incomeData.costOfSales || 0)}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Marge brute</span>
                        <span className={`font-bold ${(incomeData.grossProfit || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(incomeData.grossProfit || 0)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Marge : {incomeData.grossMargin?.toFixed(1) || '0.0'}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Résultat d&apos;exploitation</span>
                      <span className={`font-bold ${(incomeData.operatingIncome || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(incomeData.operatingIncome || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Résultat financier</span>
                      <span className={`font-medium ${(incomeData.financialIncome || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(incomeData.financialIncome || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Résultat exceptionnel</span>
                      <span className={`font-medium ${(incomeData.extraordinaryIncome || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(incomeData.extraordinaryIncome || 0)}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                      <div className="flex justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Résultat avant impôt</span>
                        <span className={`font-bold ${(incomeData.incomeBeforeTax || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(incomeData.incomeBeforeTax || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg p-6 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white">Résultat avant impôt</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(incomeData.incomeBeforeTax || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-900 dark:text-white">Impôt sur les bénéfices</span>
                    <span className="text-gray-900 dark:text-white">
                      - {formatCurrency(incomeData.incomeTax || 0)}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-400 dark:border-gray-500 pt-3 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        RÉSULTAT NET
                      </span>
                      <span className={`text-3xl font-bold ${(incomeData.netIncome || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(incomeData.netIncome || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Ratios de performance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Marge brute
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {incomeData.grossMargin?.toFixed(1) || '0.0'}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Marge d&apos;exploitation
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {incomeData.operatingMargin?.toFixed(1) || '0.0'}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Marge nette
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {incomeData.netMargin?.toFixed(1) || '0.0'}%
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Taux d&apos;imposition
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {incomeData.taxRate?.toFixed(1) || '0.0'}%
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

export default IncomeStatement;
