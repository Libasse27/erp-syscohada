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
import { Login, Register } from './pages/Auth';

// Pages Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Pages Ventes
import {
  CustomerList,
  CustomerCreate,
  QuoteList,
  QuoteCreate,
  InvoiceList,
  InvoiceCreate,
} from './pages/Sales';

// Pages Achats
import {
  SupplierList,
  SupplierCreate,
  PurchaseOrderList,
  PurchaseOrderCreate,
  BillList,
  BillCreate,
} from './pages/Purchases';

// Pages Stock
import {
  ProductList,
  ProductCreate,
  StockMovementList,
  StockMovementCreate,
  InventoryList,
  InventoryCreate,
} from './pages/Inventory';

// Pages Comptabilité
import {
  AccountList,
  AccountingEntryList,
  AccountingEntryCreate,
  JournalList,
  GeneralLedger,
  TrialBalance,
} from './pages/Accounting';

// Pages Trésorerie
import {
  PaymentList,
  PaymentCreate,
  BankAccountList,
  CashFlow,
} from './pages/Treasury';

// Pages Rapports
import {
  FinancialReports,
  SalesReports,
  PurchaseReports,
  StockReports,
  VATReport,
  BalanceSheet,
  IncomeStatement,
} from './pages/Reports';

// Pages Paramètres
import {
  CompanySettings,
  UserSettings,
  SystemSettings,
  FiscalYearSettings,
} from './pages/Settings';

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
            <Route path="customers/new" element={<CustomerCreate />} />
            <Route path="customers/:id/edit" element={<CustomerCreate />} />

            <Route path="quotes" element={<QuoteList />} />
            <Route path="quotes/new" element={<QuoteCreate />} />
            <Route path="quotes/:id/edit" element={<QuoteCreate />} />

            <Route path="invoices" element={<InvoiceList />} />
            <Route path="invoices/new" element={<InvoiceCreate />} />
            <Route path="invoices/:id/edit" element={<InvoiceCreate />} />
          </Route>

          {/* Achats */}
          <Route path="/dashboard/purchases">
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/new" element={<SupplierCreate />} />
            <Route path="suppliers/:id/edit" element={<SupplierCreate />} />

            <Route path="orders" element={<PurchaseOrderList />} />
            <Route path="orders/new" element={<PurchaseOrderCreate />} />
            <Route path="orders/:id/edit" element={<PurchaseOrderCreate />} />

            <Route path="bills" element={<BillList />} />
            <Route path="bills/new" element={<BillCreate />} />
            <Route path="bills/:id/edit" element={<BillCreate />} />
          </Route>

          {/* Stock */}
          <Route path="/dashboard/inventory">
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductCreate />} />
            <Route path="products/:id/edit" element={<ProductCreate />} />

            <Route path="movements" element={<StockMovementList />} />
            <Route path="movements/new" element={<StockMovementCreate />} />

            <Route path="inventories" element={<InventoryList />} />
            <Route path="inventories/new" element={<InventoryCreate />} />
            <Route path="inventories/:id/edit" element={<InventoryCreate />} />
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
