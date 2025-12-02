import { Outlet } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

/**
 * Dashboard page wrapper
 * Main container for all dashboard-related pages
 * Uses MainLayout which includes Header, Sidebar, Footer, and Breadcrumb
 */
const Dashboard = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default Dashboard;
