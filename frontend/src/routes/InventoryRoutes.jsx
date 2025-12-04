/**
 * Routes pour le module Stock
 */

import { Routes, Route } from 'react-router-dom';
import ProductList from '../pages/Inventory/ProductList';
import ProductCreate from '../pages/Inventory/ProductCreate';
import ProductDetail from '../pages/Inventory/ProductDetail';
import StockMovementList from '../pages/Inventory/StockMovementList';
import CategoryList from '../pages/Inventory/CategoryList';
import InventoryReport from '../pages/Inventory/InventoryReport';

const InventoryRoutes = () => {
  return (
    <Routes>
      {/* Produits */}
      <Route path="products" element={<ProductList />} />
      <Route path="products/new" element={<ProductCreate />} />
      <Route path="products/:id" element={<ProductDetail />} />
      <Route path="products/:id/edit" element={<ProductCreate />} />

      {/* Mouvements de stock */}
      <Route path="movements" element={<StockMovementList />} />

      {/* Catégories */}
      <Route path="categories" element={<CategoryList />} />

      {/* Rapport d'inventaire */}
      <Route path="report" element={<InventoryReport />} />
    </Routes>
  );
};

export default InventoryRoutes;
