import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import AdminDashboard from './AdminDashboard';
import AdminHouses from './AdminHouses';
import AdminColors from './AdminColors';
import AdminSizes from './AdminSizes';
import AdminOrders from './AdminOrders';
import AdminQuotes from './AdminQuotes';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';

const AdminApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page: string) => {
    if (page === 'logout') {
      // Logique de déconnexion
      window.location.href = '/';
      return;
    }
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'houses':
        return <AdminHouses />;
      case 'colors':
        return <AdminColors />;
      case 'sizes':
        return <AdminSizes />;
      case 'orders':
        return <AdminOrders />;
      case 'quotes':
        return <AdminQuotes />;
      case 'users':
        return <AdminUsers />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <>
      <AdminLayout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderCurrentPage()}
      </AdminLayout>
      <Toaster position="top-right" />
    </>
  );
};

export default AdminApp;