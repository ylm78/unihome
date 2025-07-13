import React, { useState, useEffect } from 'react';
import { Home, Package, ShoppingCart, FileText, TrendingUp, Users } from 'lucide-react';
import { supabase, HouseService, QuoteService, OrderService, UserService } from '../../lib/supabase';

interface DashboardStats {
  totalHouses: number;
  totalOrders: number;
  totalQuotes: number;
  totalUsers: number;
  monthlyRevenue: number;
  pendingQuotes: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHouses: 0,
    totalOrders: 0,
    totalQuotes: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    pendingQuotes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Charger les données de base une par une pour éviter les erreurs
      const housesResult = await supabase.from('houses').select('id');
      const quotesResult = await supabase.from('quotes').select('id, status, total_price');
      const ordersResult = await supabase.from('orders').select('id, total_price');
      const userProfilesResult = await supabase.from('user_profiles').select('id');
      
      const houses = housesResult.data || [];
      const quotes = quotesResult.data || [];
      const orders = ordersResult.data || [];
      const userProfiles = userProfilesResult.data || [];
      
      console.log('✅ Données chargées:', {
        houses: houses.length,
        quotes: quotes.length,
        orders: orders.length,
        users: userProfiles.length
      });
      
      const totalRevenue = orders.reduce((sum, order) => {
        return sum + Math.round((order.total_price || 0) / 100);
      }, 0);
      
      const pendingQuotes = quotes.filter(q => q.status === 'pending').length;
      
      setStats({
        totalHouses: houses.length,
        totalOrders: orders.length,
        totalQuotes: quotes.length,
        totalUsers: userProfiles.length,
        monthlyRevenue: totalRevenue,
        pendingQuotes: pendingQuotes,
      });
    } catch (error: any) {
      console.error('❌ Erreur lors du chargement des statistiques:', error.message);
      // Définir des valeurs par défaut en cas d'erreur
      setStats({
        totalHouses: 0,
        totalOrders: 0,
        totalQuotes: 0,
        totalUsers: 0,
        monthlyRevenue: 0,
        pendingQuotes: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Maisons',
      value: stats.totalHouses,
      icon: Home,
      color: 'bg-blue-500',
      change: '+2 ce mois',
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-green-500',
      change: '+12% vs mois dernier',
    },
    {
      title: 'Devis',
      value: stats.totalQuotes,
      icon: FileText,
      color: 'bg-yellow-500',
      change: `${stats.pendingQuotes} en attente`,
    },
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8 cette semaine',
    },
    {
      title: 'CA mensuel',
      value: `${stats.monthlyRevenue.toLocaleString('fr-FR')}€`,
      icon: TrendingUp,
      color: 'bg-amber-500',
      change: '+15% vs mois dernier',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de votre activité</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{card.change}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphiques et tableaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commandes récentes */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dernières commandes</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
              </div>
            ) : (
              <RecentOrdersList />
            )}
          </div>
        </div>

        {/* Devis en attente */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Derniers devis</h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
              </div>
            ) : (
              <RecentQuotesList />
            )}
          </div>
        </div>
      </div>

      {/* Graphique des ventes */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Évolution des ventes</h3>
        </div>
        <div className="p-6">
          <div className="h-64 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Graphique des ventes (à intégrer avec Chart.js)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour afficher les commandes récentes
const RecentOrdersList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  
  React.useEffect(() => {
    loadRecentOrders();
  }, []);
  
  const loadRecentOrders = async () => {
    try {
      // Simple query without any joins to avoid RLS recursion
      const { data, error } = await supabase
        .from('quotes')
        .select('id, user_id, total_price, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('❌ Erreur commandes:', error.message);
        setOrders([]);
        return;
      }
      
      console.log('✅ Commandes chargées:', data?.length || 0);
      setOrders(data || []);
    } catch (error: any) {
      console.error('❌ Exception commandes:', error.message);
      setOrders([]);
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmée';
      case 'in_production': return 'En production';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'in_production': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div>
            <p className="font-medium text-gray-900">#{order.id.slice(0, 8)}</p>
            <p className="text-sm text-gray-600">
              Client #{order.user_id?.slice(0, 8) || 'Inconnu'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">
              {Math.round(order.total_price / 100).toLocaleString('fr-FR')}€
            </p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(order.status)}`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <p className="text-gray-500 text-center py-4">Aucune commande récente</p>
      )}
    </div>
  );
};

// Composant pour afficher les devis récents
const RecentQuotesList: React.FC = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  
  React.useEffect(() => {
    loadRecentQuotes();
  }, []);
  
  const loadRecentQuotes = async () => {
    try {
      // Simple query without any joins to avoid RLS recursion
      const { data, error } = await supabase
        .from('quotes')
        .select('id, user_id, house_id, total_price, status, created_at')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('❌ Erreur devis:', error.message);
        setQuotes([]);
        return;
      }
      
      console.log('✅ Devis chargés:', data?.length || 0);
      setQuotes(data || []);
    } catch (error: any) {
      console.error('❌ Exception devis:', error.message);
      setQuotes([]);
    }
  };
  
  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <div key={quote.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
          <div>
            <p className="font-medium text-gray-900">#D{quote.id.slice(0, 6)}</p>
            <p className="text-sm text-gray-600">
              Client #{quote.user_id?.slice(0, 8) || 'Inconnu'}
            </p>
            <p className="text-xs text-gray-500">Maison #{quote.house_id?.slice(0, 8) || 'Inconnue'}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-gray-900">
              {Math.round(quote.total_price / 100).toLocaleString('fr-FR')}€
            </p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              quote.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-red-100 text-red-800'
            }`}>
              {quote.status === 'pending' ? 'En attente' :
               quote.status === 'approved' ? 'Approuvé' : 'Rejeté'}
            </span>
          </div>
        </div>
      ))}
      {quotes.length === 0 && (
        <p className="text-gray-500 text-center py-4">Aucun devis récent</p>
      )}
    </div>
  );
};

export default AdminDashboard;