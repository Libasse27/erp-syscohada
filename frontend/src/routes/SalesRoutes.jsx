/**
 * Routes pour le module Ventes
 */

import { Routes, Route } from 'react-router-dom';
import CustomerList from '../pages/Sales/CustomerList';
import CustomerDetail from '../pages/Sales/CustomerDetail';
import QuoteList from '../pages/Sales/QuoteList';
import QuoteCreate from '../pages/Sales/QuoteCreate';
import InvoiceList from '../pages/Sales/InvoiceList';
import InvoiceCreate from '../pages/Sales/InvoiceCreate';
import InvoiceDetail from '../pages/Sales/InvoiceDetail';

const SalesRoutes = () => {
  return (
    <Routes>
      {/* Clients */}
      <Route path="customers" element={<CustomerList />} />
      <Route path="customers/:id" element={<CustomerDetail />} />

      {/* Devis */}
      <Route path="quotes" element={<QuoteList />} />
      <Route path="quotes/new" element={<QuoteCreate />} />
      <Route path="quotes/:id/edit" element={<QuoteCreate />} />

      {/* Factures */}
      <Route path="invoices" element={<InvoiceList />} />
      <Route path="invoices/new" element={<InvoiceCreate />} />
      <Route path="invoices/:id" element={<InvoiceDetail />} />
      <Route path="invoices/:id/edit" element={<InvoiceCreate />} />
    </Routes>
  );
};

export default SalesRoutes;
