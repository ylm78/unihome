import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminApp from './pages/admin/AdminApp';
import AdminLoginPage from './pages/admin/AdminLoginPage';
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

// ✅ Route protégée admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⛔</div>
          <h1 className="text-2xl font-bold text-red-900 mb-4">Accès administrateur requis</h1>
          <p className="text-red-700 mb-2">Seuls les administrateurs peuvent accéder à cette section.</p>
          <p className="text-red-600 text-sm mb-6">Votre compte : {user.email}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ✅ Layout pour les pages publiques
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path.startsWith('/catalog')) return 'catalog';
    if (path.startsWith('/product')) return 'product';
    if (path === '/cart') return 'cart';
    if (path === '/login') return 'login';
    if (path === '/quote') return 'quote';
    if (path === '/build') return 'build';
    if (path === '/faq') return 'faq';
    if (path === '/contact') return 'contact';
    return 'home';
  };

  const handleNavigate = (page: string, data?: any) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'catalog':
        navigate('/catalog');
        break;
      case 'product':
        navigate(`/product/${data?.productId || ''}`);
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'quote':
        navigate('/quote', { state: data });
        break;
      case 'build':
        navigate('/build');
        break;
      case 'faq':
        navigate('/faq');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'admin':
        navigate('/admin');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Header currentPage={getCurrentPage()} onNavigate={handleNavigate} />
      <main>{children}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

// ✅ Pages avec navigation
const HomePageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'product') {
      navigate(`/product/${data?.productId}`);
    } else if (page === 'catalog') {
      navigate('/catalog');
    }
  };

  const handleAddToCart = (house: ContainerHouse) => {
    // Logique d'ajout au panier
  };

  return <HomePage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
};

const CatalogPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'product') {
      navigate(`/product/${data?.productId}`);
    }
  };

  const handleAddToCart = (house: ContainerHouse) => {
    // Logique d'ajout au panier
  };

  return <CatalogPage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
};

const ProductPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const productId = location.pathname.split('/product/')[1] || '';
  
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'catalog') {
      navigate('/catalog');
    } else if (page === 'quote') {
      navigate('/quote', { state: data });
    }
  };

  return <ProductPage productId={productId} onNavigate={handleNavigate} />;
};

const CartPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string, data?: any) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'catalog') {
      navigate('/catalog');
    } else if (page === 'quote') {
      navigate('/quote', { state: data });
    }
  };

  return <CartPage onNavigate={handleNavigate} />;
};

const LoginPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    }
  };

  return <LoginPage onNavigate={handleNavigate} />;
};

const QuotePageWithNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    }
  };

  return <QuotePage onNavigate={handleNavigate} initialData={location.state} />;
};

const BuildPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'contact') {
      navigate('/contact');
    } else if (page === 'quote') {
      navigate('/quote');
    }
  };

  return <BuildPage onNavigate={handleNavigate} />;
};

const FAQPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    } else if (page === 'contact') {
      navigate('/contact');
    }
  };

  return <FAQPage onNavigate={handleNavigate} />;
};

const ContactPageWithNav: React.FC = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    if (page === 'home') {
      navigate('/');
    }
  };

  return <ContactPage onNavigate={handleNavigate} />;
};

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
      {/* Route admin */}
      <Route path="/admin" element={<AdminRoute><AdminApp /></AdminRoute>} />
      
      {/* Routes publiques avec layout */}
      <Route path="/" element={<PublicLayout><HomePageWithNav /></PublicLayout>} />
      <Route path="/catalog" element={<PublicLayout><CatalogPageWithNav /></PublicLayout>} />
      <Route path="/product/:id" element={<PublicLayout><ProductPageWithNav /></PublicLayout>} />
      <Route path="/cart" element={<PublicLayout><CartPageWithNav /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPageWithNav /></PublicLayout>} />
      <Route path="/quote" element={<PublicLayout><QuotePageWithNav /></PublicLayout>} />
      <Route path="/build" element={<PublicLayout><BuildPageWithNav /></PublicLayout>} />
      <Route path="/faq" element={<PublicLayout><FAQPageWithNav /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><ContactPageWithNav /></PublicLayout>} />
      
      {/* Fallback */}
      <Route path="*" element={<PublicLayout><HomePageWithNav /></PublicLayout>} />
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