/**
 * Composant principal de l'application ERP SYSCOHADA
 * Gère le routing et la structure de l'application
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import MainLayout from './components/layout/MainLayout';
import { selectIsAuthenticated } from './store/slices/authSlice';

// Pages d'authentification
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Pages Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Pages Ventes
import CustomerList from './pages/Sales/CustomerList';
import CustomerDetail from './pages/Sales/CustomerDetail';
import QuoteList from './pages/Sales/QuoteList';
import QuoteCreate from './pages/Sales/QuoteCreate';
import InvoiceList from './pages/Sales/InvoiceList';
import InvoiceCreate from './pages/Sales/InvoiceCreate';
import InvoiceDetail from './pages/Sales/InvoiceDetail';

// Pages Achats
import SupplierList from './pages/Purchases/SupplierList';
import SupplierDetail from './pages/Purchases/SupplierDetail';
import PurchaseOrderList from './pages/Purchases/PurchaseOrderList';
import PurchaseOrderCreate from './pages/Purchases/PurchaseOrderCreate';
import PurchaseOrderDetail from './pages/Purchases/PurchaseOrderDetail';

// Pages Stock
import ProductList from './pages/Inventory/ProductList';
import ProductCreate from './pages/Inventory/ProductCreate';
import ProductDetail from './pages/Inventory/ProductDetail';
import StockMovementList from './pages/Inventory/StockMovementList';
import CategoryList from './pages/Inventory/CategoryList';
import InventoryReport from './pages/Inventory/InventoryReport';

// Pages Comptabilité
import AccountList from './pages/Accounting/AccountList';
import AccountingEntryList from './pages/Accounting/AccountingEntryList';
import AccountingEntryCreate from './pages/Accounting/AccountingEntryCreate';
import JournalList from './pages/Accounting/JournalList';
import GeneralLedger from './pages/Accounting/GeneralLedger';
import TrialBalance from './pages/Accounting/TrialBalance';

// Pages Trésorerie
import PaymentList from './pages/Treasury/PaymentList';
import PaymentCreate from './pages/Treasury/PaymentCreate';
import BankAccountList from './pages/Treasury/BankAccountList';
import CashFlow from './pages/Treasury/CashFlow';

// Pages Rapports
import FinancialReports from './pages/Reports/FinancialReports';
import SalesReports from './pages/Reports/SalesReports';
import PurchaseReports from './pages/Reports/PurchaseReports';
import StockReports from './pages/Reports/StockReports';
import VATReport from './pages/Reports/VATReport';
import BalanceSheet from './pages/Reports/BalanceSheet';
import IncomeStatement from './pages/Reports/IncomeStatement';

// Pages Paramètres
import CompanySettings from './pages/Settings/CompanySettings';
import UserSettings from './pages/Settings/UserSettings';
import SystemSettings from './pages/Settings/SystemSettings';
import FiscalYearSettings from './pages/Settings/FiscalYearSettings';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <div className="App">
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
        } />

        {/* Routes protégées avec layout */}
        <Route element={
          <PrivateRoute>
            <MainLayout />
          </PrivateRoute>
        }>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Ventes */}
          <Route path="/dashboard/sales">
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/:id" element={<CustomerDetail />} />

            <Route path="quotes" element={<QuoteList />} />
            <Route path="quotes/new" element={<QuoteCreate />} />
            <Route path="quotes/:id/edit" element={<QuoteCreate />} />

            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/new" element={<InvoiceCreate />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
            <Route path="invoices/:id/edit" element={<InvoiceCreate />} />
          </Route>

          {/* Achats */}
          <Route path="/dashboard/purchases">
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/:id" element={<SupplierDetail />} />

            <Route path="orders" element={<PurchaseOrderList />} />
            <Route path="orders/new" element={<PurchaseOrderCreate />} />
            <Route path="orders/:id" element={<PurchaseOrderDetail />} />
            <Route path="orders/:id/edit" element={<PurchaseOrderCreate />} />
          </Route>

          {/* Stock */}
          <Route path="/dashboard/inventory">
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductCreate />} />
            <Route path="products/:id" element={<ProductDetail />} />
            <Route path="products/:id/edit" element={<ProductCreate />} />

            <Route path="movements" element={<StockMovementList />} />
            <Route path="categories" element={<CategoryList />} />
            <Route path="report" element={<InventoryReport />} />
          </Route>

          {/* Comptabilité */}
          <Route path="/dashboard/accounting">
            <Route path="accounts" element={<AccountList />} />
            <Route path="entries" element={<AccountingEntryList />} />
            <Route path="entries/new" element={<AccountingEntryCreate />} />
            <Route path="entries/:id/edit" element={<AccountingEntryCreate />} />
            <Route path="journals" element={<JournalList />} />
            <Route path="general-ledger" element={<GeneralLedger />} />
            <Route path="trial-balance" element={<TrialBalance />} />
          </Route>

          {/* Trésorerie */}
          <Route path="/dashboard/treasury">
            <Route path="payments" element={<PaymentList />} />
            <Route path="payments/new" element={<PaymentCreate />} />
            <Route path="payments/:id/edit" element={<PaymentCreate />} />
            <Route path="bank-accounts" element={<BankAccountList />} />
            <Route path="cash-flow" element={<CashFlow />} />
          </Route>

          {/* Rapports */}
          <Route path="/dashboard/reports">
            <Route index element={<FinancialReports />} />
            <Route path="sales" element={<SalesReports />} />
            <Route path="purchases" element={<PurchaseReports />} />
            <Route path="stock" element={<StockReports />} />
            <Route path="vat" element={<VATReport />} />
            <Route path="balance-sheet" element={<BalanceSheet />} />
            <Route path="income-statement" element={<IncomeStatement />} />
          </Route>

          {/* Paramètres */}
          <Route path="/dashboard/settings">
            <Route path="company" element={<CompanySettings />} />
            <Route path="users" element={<UserSettings />} />
            <Route path="system" element={<SystemSettings />} />
            <Route path="fiscal-years" element={<FiscalYearSettings />} />
          </Route>
        </Route>

        {/* Redirection par défaut */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } />

        {/* Route 404 - Page non trouvée */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Page non trouvée
              </p>
              <a
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
