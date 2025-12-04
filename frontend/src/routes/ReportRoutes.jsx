/**
 * Routes pour le module Rapports
 */

import { Routes, Route } from 'react-router-dom';
import FinancialReports from '../pages/Reports/FinancialReports';
import SalesReports from '../pages/Reports/SalesReports';
import PurchaseReports from '../pages/Reports/PurchaseReports';
import StockReports from '../pages/Reports/StockReports';
import VATReport from '../pages/Reports/VATReport';
import BalanceSheet from '../pages/Reports/BalanceSheet';
import IncomeStatement from '../pages/Reports/IncomeStatement';

const ReportRoutes = () => {
  return (
    <Routes>
      {/* Page principale */}
      <Route index element={<FinancialReports />} />

      {/* Rapports financiers */}
      <Route path="sales" element={<SalesReports />} />
      <Route path="purchases" element={<PurchaseReports />} />
      <Route path="stock" element={<StockReports />} />
      <Route path="vat" element={<VATReport />} />
      <Route path="balance-sheet" element={<BalanceSheet />} />
      <Route path="income-statement" element={<IncomeStatement />} />
    </Routes>
  );
};

export default ReportRoutes;
