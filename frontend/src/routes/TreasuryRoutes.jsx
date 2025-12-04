/**
 * Routes pour le module Trésorerie
 */

import { Routes, Route } from 'react-router-dom';
import PaymentList from '../pages/Treasury/PaymentList';
import PaymentCreate from '../pages/Treasury/PaymentCreate';
import BankAccountList from '../pages/Treasury/BankAccountList';
import CashFlow from '../pages/Treasury/CashFlow';

const TreasuryRoutes = () => {
  return (
    <Routes>
      {/* Paiements */}
      <Route path="payments" element={<PaymentList />} />
      <Route path="payments/new" element={<PaymentCreate />} />
      <Route path="payments/:id/edit" element={<PaymentCreate />} />

      {/* Comptes bancaires */}
      <Route path="bank-accounts" element={<BankAccountList />} />

      {/* Flux de trésorerie */}
      <Route path="cash-flow" element={<CashFlow />} />
    </Routes>
  );
};

export default TreasuryRoutes;
