/**
 * Dashboard - Page principale du tableau de bord
 * Affiche les KPIs, statistiques, graphiques et alertes
 * Utilise Redux pour la gestion d'état
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchDashboardData,
  fetchSalesChart,
  setPeriod,
  selectDashboardData,
  selectPeriod,
  selectDashboardLoading,
} from '../../store/slices/dashboardSlice';
import { setBreadcrumbs, setPageTitle } from '../../store/slices/uiSlice';
import { formatCurrency, formatDate, formatNumber } from '../../utils';

const Dashboard = () => {
  const dispatch = useDispatch();

  // Sélecteurs Redux
  const dashboardData = useSelector(selectDashboardData);
  const period = useSelector(selectPeriod);
  const loading = useSelector(selectDashboardLoading);

  const { stats, alerts, recentActivities, topProducts, topCustomers, salesChart } = dashboardData;

  // Initialisation et chargement des données
  useEffect(() => {
    dispatch(setPageTitle('Tableau de bord'));
    dispatch(setBreadcrumbs([{ label: 'Tableau de bord', path: '/dashboard' }]));
    dispatch(fetchDashboardData(period));
  }, [dispatch, period]);

  // Changement de période
  const handlePeriodChange = (newPeriod) => {
    dispatch(setPeriod(newPeriod));
    dispatch(fetchSalesChart(newPeriod));
  };

  // ========== COMPOSANTS ==========

  const StatCard = ({ title, value, icon, percentage, trend, color, link }) => (
    <div className="col-md-6 col-xl-3 mb-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div className="flex-grow-1">
              <h6 className="text-muted text-uppercase mb-2" style={{ fontSize: '0.75rem' }}>
                {title}
              </h6>
              <h3 className="mb-0 fw-bold">{value}</h3>
              {percentage !== undefined && (
                <div className="mt-2">
                  <span className={`badge bg-${trend === 'up' ? 'success' : 'danger'} bg-opacity-10 text-${trend === 'up' ? 'success' : 'danger'}`}>
                    <i className={`bi bi-arrow-${trend === 'up' ? 'up' : 'down'}`} style={{ fontSize: '0.625rem' }}></i>
                    {' '}{Math.abs(percentage)}%
                  </span>
                  <small className="text-muted ms-2">vs mois dernier</small>
                </div>
              )}
            </div>
            <div className={`bg-${color} bg-opacity-10 p-3 rounded`}>
              <i className={`bi bi-${icon} text-${color}`} style={{ fontSize: '1.5rem' }}></i>
            </div>
          </div>
          {link && (
            <Link to={link} className="btn btn-link btn-sm p-0 mt-2 text-decoration-none">
              Voir détails →
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ alert }) => {
    const getAlertColor = (type) => {
      switch (type) {
        case 'danger': return 'danger';
        case 'warning': return 'warning';
        case 'info': return 'info';
        default: return 'secondary';
      }
    };

    return (
      <div className={`alert alert-${getAlertColor(alert.type)} d-flex align-items-center mb-2`} role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        <div className="flex-grow-1">
          <strong>{alert.title}</strong>
          <p className="mb-0 small">{alert.message}</p>
        </div>
        {alert.link && (
          <Link to={alert.link} className="btn btn-sm btn-outline-secondary ms-2">
            Voir
          </Link>
        )}
      </div>
    );
  };

  // ========== RENDER ==========

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* En-tête */}
      <div className="row mb-4">
        <div className="col">
          <h2 className="mb-0">Tableau de bord</h2>
          <p className="text-muted">Bienvenue sur votre tableau de bord ERP SYSCOHADA</p>
        </div>
        <div className="col-auto">
          <div className="btn-group" role="group">
            <button
              type="button"
              className={`btn btn-sm ${period === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handlePeriodChange('week')}
            >
              Semaine
            </button>
            <button
              type="button"
              className={`btn btn-sm ${period === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handlePeriodChange('month')}
            >
              Mois
            </button>
            <button
              type="button"
              className={`btn btn-sm ${period === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handlePeriodChange('year')}
            >
              Année
            </button>
          </div>
        </div>
      </div>

      {/* Cartes de statistiques */}
      <div className="row">
        <StatCard
          title="Ventes"
          value={formatCurrency(stats.sales?.total || 0)}
          icon="cart-check"
          percentage={stats.sales?.percentage}
          trend={stats.sales?.trend}
          color="primary"
          link="/sales/invoices"
        />
        <StatCard
          title="Achats"
          value={formatCurrency(stats.purchases?.total || 0)}
          icon="receipt"
          percentage={stats.purchases?.percentage}
          trend={stats.purchases?.trend}
          color="success"
          link="/purchases/orders"
        />
        <StatCard
          title="Stock"
          value={formatNumber(stats.inventory?.total || 0)}
          icon="boxes"
          percentage={stats.inventory?.percentage}
          trend={stats.inventory?.trend}
          color="warning"
          link="/inventory/products"
        />
        <StatCard
          title="Clients"
          value={formatNumber(stats.customers?.total || 0)}
          icon="people"
          percentage={stats.customers?.percentage}
          trend={stats.customers?.trend}
          color="info"
          link="/sales/customers"
        />
      </div>

      {/* Alertes */}
      {alerts.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">
                  <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                  Alertes ({alerts.length})
                </h5>
              </div>
              <div className="card-body">
                {alerts.map((alert, index) => (
                  <AlertCard key={index} alert={alert} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graphiques et listes */}
      <div className="row">
        {/* Graphique des ventes */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-graph-up text-primary me-2"></i>
                Évolution des ventes
              </h5>
            </div>
            <div className="card-body">
              {salesChart.labels?.length > 0 ? (
                <div className="chart-container" style={{ position: 'relative', height: '300px' }}>
                  {/* Graphique simple avec barres CSS */}
                  <div className="d-flex align-items-end justify-content-around h-100 pb-4">
                    {salesChart.data?.map((value, index) => {
                      const maxValue = Math.max(...salesChart.data);
                      const height = (value / maxValue) * 100;
                      return (
                        <div key={index} className="text-center" style={{ width: '8%' }}>
                          <div
                            className="bg-primary rounded-top"
                            style={{
                              height: `${height}%`,
                              minHeight: '20px',
                              transition: 'height 0.3s ease',
                            }}
                            title={formatCurrency(value)}
                          />
                          <small className="d-block mt-2 text-muted">{salesChart.labels[index]}</small>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted py-5">
                  <p>Aucune donnée disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activités récentes */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-clock-history text-info me-2"></i>
                Activités récentes
              </h5>
            </div>
            <div className="card-body" style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {recentActivities.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="list-group-item px-0 border-0 border-bottom">
                      <div className="d-flex w-100 justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="mb-1 small">{activity.title}</h6>
                          <p className="mb-1 small text-muted">{activity.description}</p>
                          <small className="text-muted">
                            <i className="bi bi-clock me-1" style={{ fontSize: '0.625rem' }}></i>
                            {formatDate(activity.date, 'datetime')}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  <p className="small">Aucune activité récente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Produits et clients */}
      <div className="row">
        {/* Top produits */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-box-seam text-warning me-2"></i>
                Produits les plus vendus
              </h5>
              <Link to="/inventory/products" className="btn btn-sm btn-outline-primary">
                Tout voir
              </Link>
            </div>
            <div className="card-body">
              {topProducts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Produit</th>
                        <th className="text-end">Quantité</th>
                        <th className="text-end">Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded p-2 me-2">
                                <i className="bi bi-box text-muted"></i>
                              </div>
                              <div>
                                <div className="fw-medium">{product.name}</div>
                                <small className="text-muted">{product.reference}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-end">{formatNumber(product.quantity)}</td>
                          <td className="text-end fw-medium">{formatCurrency(product.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  <p>Aucun produit</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top clients */}
        <div className="col-lg-6 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-people text-info me-2"></i>
                Meilleurs clients
              </h5>
              <Link to="/sales/customers" className="btn btn-sm btn-outline-primary">
                Tout voir
              </Link>
            </div>
            <div className="card-body">
              {topCustomers.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th className="text-end">Commandes</th>
                        <th className="text-end">Montant total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCustomers.map((customer, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="bg-light rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <i className="bi bi-person text-muted"></i>
                              </div>
                              <div>
                                <div className="fw-medium">{customer.name}</div>
                                <small className="text-muted">{customer.email}</small>
                              </div>
                            </div>
                          </td>
                          <td className="text-end">{formatNumber(customer.ordersCount)}</td>
                          <td className="text-end fw-medium">{formatCurrency(customer.totalAmount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center text-muted py-3">
                  <p>Aucun client</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicateurs financiers */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-cash-stack text-success me-2"></i>
                Indicateurs financiers
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="border-end">
                    <h3 className="text-primary mb-0">{formatCurrency(stats.revenue || 0)}</h3>
                    <small className="text-muted">Chiffre d'affaires</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="border-end">
                    <h3 className="text-success mb-0">{formatCurrency(stats.profit || 0)}</h3>
                    <small className="text-muted">Bénéfice net</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="border-end">
                    <h3 className="text-warning mb-0">{formatCurrency(stats.expenses || 0)}</h3>
                    <small className="text-muted">Dépenses</small>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <h3 className="text-info mb-0">{stats.profitMargin || 0}%</h3>
                  <small className="text-muted">Marge bénéficiaire</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
