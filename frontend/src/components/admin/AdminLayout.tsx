import React, { useState } from 'react';
import { 
  Home, 
  Package, 
  Palette, 
  Ruler, 
  ShoppingCart, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Menu,
  X,
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentPage, onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', name: 'Tableau de bord', icon: BarChart3 },
    { id: 'houses', name: 'Maisons', icon: Home },
    { id: 'colors', name: 'Couleurs', icon: Palette },
    { id: 'sizes', name: 'Tailles', icon: Ruler },
    { id: 'orders', name: 'Commandes', icon: ShoppingCart },
    { id: 'quotes', name: 'Devis', icon: FileText },
    { id: 'users', name: 'Utilisateurs', icon: Users },
    { id: 'settings', name: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-lg font-bold text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === item.id
                      ? 'bg-amber-100 text-amber-900 border-r-2 border-amber-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-3" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <button
            onClick={() => onNavigate('logout')}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 capitalize">
              {menuItems.find(item => item.id === currentPage)?.name || 'Administration'}
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;