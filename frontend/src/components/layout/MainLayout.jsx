import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';
import { selectSidebarOpen, selectTheme, setIsMobile } from '../../store/slices/uiSlice';

const MainLayout = () => {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector(selectSidebarOpen);
  const theme = useSelector(selectTheme);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      dispatch(setIsMobile(window.innerWidth < 1024));
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Header */}
        <Header />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {/* Breadcrumb */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
            <Breadcrumb />
          </div>

          {/* Content wrapper */}
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Toast notifications container */}
      <div
        id="toast-container"
        className="fixed top-20 right-4 z-50 space-y-2 max-w-sm w-full"
        aria-live="polite"
        aria-atomic="true"
      />
    </div>
  );
};

export default MainLayout;
