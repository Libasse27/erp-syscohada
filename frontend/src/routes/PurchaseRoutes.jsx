/**
 * Routes pour le module Achats
 */

import { Routes, Route } from 'react-router-dom';
import SupplierList from '../pages/Purchases/SupplierList';
import SupplierDetail from '../pages/Purchases/SupplierDetail';
import PurchaseOrderList from '../pages/Purchases/PurchaseOrderList';
import PurchaseOrderCreate from '../pages/Purchases/PurchaseOrderCreate';
import PurchaseOrderDetail from '../pages/Purchases/PurchaseOrderDetail';

const PurchaseRoutes = () => {
  return (
    <Routes>
      {/* Fournisseurs */}
      <Route path="suppliers" element={<SupplierList />} />
      <Route path="suppliers/:id" element={<SupplierDetail />} />

      {/* Commandes */}
      <Route path="orders" element={<PurchaseOrderList />} />
      <Route path="orders/new" element={<PurchaseOrderCreate />} />
      <Route path="orders/:id" element={<PurchaseOrderDetail />} />
      <Route path="orders/:id/edit" element={<PurchaseOrderCreate />} />
    </Routes>
  );
};

export default PurchaseRoutes;
