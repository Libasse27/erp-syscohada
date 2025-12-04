/**
 * Routes pour le module Comptabilité
 */

import { Routes, Route } from 'react-router-dom';
import AccountList from '../pages/Accounting/AccountList';
import AccountingEntryList from '../pages/Accounting/AccountingEntryList';
import AccountingEntryCreate from '../pages/Accounting/AccountingEntryCreate';
import JournalList from '../pages/Accounting/JournalList';
import GeneralLedger from '../pages/Accounting/GeneralLedger';
import TrialBalance from '../pages/Accounting/TrialBalance';

const AccountingRoutes = () => {
  return (
    <Routes>
      {/* Plan comptable */}
      <Route path="accounts" element={<AccountList />} />

      {/* Écritures comptables */}
      <Route path="entries" element={<AccountingEntryList />} />
      <Route path="entries/new" element={<AccountingEntryCreate />} />
      <Route path="entries/:id/edit" element={<AccountingEntryCreate />} />

      {/* Journaux */}
      <Route path="journals" element={<JournalList />} />

      {/* Grand livre */}
      <Route path="general-ledger" element={<GeneralLedger />} />

      {/* Balance */}
      <Route path="trial-balance" element={<TrialBalance />} />
    </Routes>
  );
};

export default AccountingRoutes;
