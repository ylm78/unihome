import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminApp from './pages/admin/AdminApp';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import QuotePage from './pages/QuotePage';
import BuildPage from './pages/BuildPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import { ContainerHouse } from './types';

// ✅ Route protégée admin (à améliorer plus tard)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

// ✅ App publique (hors espace admin)
const PublicApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [navigationData, setNavigationData] = useState<NavigationData>({});
  const { addToCart } = useCart();

  const handleNavigate = (page: string, data?: NavigationData) => {
    setCurrentPage(page);
    setNavigationData(data || {});
  };

  const handleAddToCart = (house: ContainerHouse) => {
    // Cette fonction peut être utilisée plus tard si besoin
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'catalog':
        return <CatalogPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'product':
        return (
          <ProductPage
            productId={navigationData.productId || ''}
            onNavigate={handleNavigate}
          />
        );
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'quote':
        return <QuotePage onNavigate={handleNavigate} initialData={navigationData} />;
      case 'build':
        return <BuildPage onNavigate={handleNavigate} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main>{renderCurrentPage()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

interface NavigationData {
  productId?: string;
  houseId?: string;
  cartItems?: any[];
}

// ✅ Wrapper avec gestion du chargement de l'utilisateur
function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Initialisation...</p>
          <p className="text-amber-600 text-sm mt-2">Connexion à la base de données</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/admin/*" element={<AdminRoute><AdminApp /></AdminRoute>} />
      <Route path="/*" element={<PublicApp />} />
    </Routes>
  );
}

// ✅ Composant racine de l'application
function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
