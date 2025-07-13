import React, { useState } from 'react';
import { Home, ShoppingCart, User, Menu, X, Search, Hammer, HelpCircle, Mail } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout, loading, isAdmin } = useAuth();

  const navigation = [
    { name: 'Accueil', id: 'home', icon: Home },
    { name: 'Catalogue', id: 'catalog', icon: Search },
    { name: 'Construire', id: 'build', icon: Hammer },
    { name: 'FAQ', id: 'faq', icon: HelpCircle },
    { name: 'Contact', id: 'contact', icon: Mail },
    { name: 'Devis', id: 'quote', icon: Search },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-700 rounded-lg flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold bg-gradient-to-r from-amber-800 to-orange-800 bg-clip-text text-transparent">
                Unihome
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.id
                    ? 'text-amber-700 bg-gradient-to-r from-amber-100 to-orange-100 shadow-md'
                    : 'text-amber-800 hover:text-amber-700 hover:bg-amber-50 hover:shadow-sm'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-amber-800 hover:text-amber-700 transition-colors group"
            >
              <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User */}
            {loading ? (
  <span className="text-sm text-gray-400">...</span>
) : user ? (
  <div className="flex items-center space-x-4">
    {isAdmin && (
      <button
        onClick={() => onNavigate('admin')}
        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md"
      >
        👑 Admin
      </button>
    )}
    <div className="flex flex-col items-end text-right">
    <span className="text-sm text-amber-800">
  {user?.firstName ? (
    <>Vous êtes connecté en tant que <strong>{user.firstName}</strong></>
  ) : (
    <>Bienvenue {isAdmin ? '👑' : ''}</>
  )}
</span>

    <button
      onClick={logout}
      className="text-sm text-blue-600 hover:underline mt-1"
    >
      Déconnexion
    </button>
    </div>
  </div>
) : (
  <button
    onClick={() => onNavigate('login')}
    className="flex items-center px-4 py-2 text-sm font-medium text-amber-800 hover:text-amber-700 transition-colors bg-amber-50 rounded-lg hover:bg-amber-100"
  >
    <User className="w-4 h-4 mr-2" />
    Connexion
  </button>
)}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-amber-800 hover:text-amber-700 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-amber-200 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  currentPage === item.id
                    ? 'text-amber-700 bg-amber-100'
                    : 'text-amber-800 hover:text-amber-700 hover:bg-amber-50'
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;