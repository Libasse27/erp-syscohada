import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Button, Select, Alert } from '../../components/common';
import { setBreadcrumb } from '../../store/slices/uiSlice';
import { formatCurrency, formatDate } from '../../utils/formatters';

/**
 * Financial Reports Page
 * Dashboard for accessing various financial reports
 */
const FinancialReports = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(setBreadcrumb([
      { label: 'Rapports', path: '/dashboard/reports' },
      { label: 'Rapports financiers' }
    ]));
  }, [dispatch]);

  const financialReports = [
    {
      id: 'balance-sheet',
      title: 'Bilan',
      description: 'État de la situation financière de l\'entreprise',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      link: '/dashboard/reports/balance-sheet',
      color: 'blue',
    },
    {
      id: 'income-statement',
      title: 'Compte de résultat',
      description: 'Analyse des produits et charges de l\'exercice',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/dashboard/reports/income-statement',
      color: 'green',
    },
    {
      id: 'cash-flow',
      title: 'Flux de trésorerie',
      description: 'Tableau des flux de trésorerie détaillé',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '/dashboard/treasury/cash-flow',
      color: 'purple',
    },
    {
      id: 'trial-balance',
      title: 'Balance de vérification',
      description: 'Synthèse des soldes des comptes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      link: '/dashboard/accounting/trial-balance',
      color: 'indigo',
    },
    {
      id: 'general-ledger',
      title: 'Grand livre',
      description: 'Détail des mouvements par compte',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '/dashboard/accounting/general-ledger',
      color: 'yellow',
    },
    {
      id: 'vat-report',
      title: 'Rapport TVA',
      description: 'Déclaration de TVA collectée et déductible',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
        </svg>
      ),
      link: '/dashboard/reports/vat-report',
      color: 'red',
    },
    {
      id: 'sales-reports',
      title: 'Rapports de ventes',
      description: 'Statistiques et analyses des ventes',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      link: '/dashboard/reports/sales-reports',
      color: 'teal',
    },
    {
      id: 'purchase-reports',
      title: 'Rapports d\'achats',
      description: 'Statistiques et analyses des achats',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      link: '/dashboard/reports/purchase-reports',
      color: 'orange',
    },
    {
      id: 'stock-reports',
      title: 'Rapports de stock',
      description: 'Valorisation et mouvements de stock',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      link: '/dashboard/reports/stock-reports',
      color: 'pink',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400',
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400',
    teal: 'bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-900/50 text-teal-600 dark:text-teal-400',
    orange: 'bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-600 dark:text-pink-400',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapports financiers
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Accédez aux différents rapports comptables et financiers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Période :</span>
          <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Aujourd&apos;hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="custom">Personnalisée</option>
          </Select>
        </div>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)}>{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financialReports.map((report) => (
          <Link key={report.id} to={report.link}>
            <Card
              className={`${colorClasses[report.color]} transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-current h-full`}
            >
              <div className="flex flex-col items-center text-center space-y-3 p-4">
                <div className="p-3 rounded-full bg-white/50 dark:bg-gray-800/50">
                  {report.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {report.description}
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="mt-2">
                  <span>Voir le rapport</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <div className="border-l-4 border-blue-500 pl-4 py-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            À propos des rapports financiers
          </h3>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>
              Les rapports financiers vous permettent d&apos;analyser la santé financière de votre entreprise
              selon les normes SYSCOHADA.
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                <strong>Bilan :</strong> Présente l&apos;actif, le passif et les capitaux propres
              </li>
              <li>
                <strong>Compte de résultat :</strong> Détaille les produits, charges et le résultat net
              </li>
              <li>
                <strong>Flux de trésorerie :</strong> Analyse les mouvements de trésorerie par activité
              </li>
              <li>
                <strong>Balance :</strong> Vérifie l&apos;équilibre des débits et crédits
              </li>
              <li>
                <strong>TVA :</strong> Calcule la TVA collectée, déductible et à payer
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              Tous les rapports peuvent être exportés en PDF ou Excel pour impression et archivage.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialReports;
