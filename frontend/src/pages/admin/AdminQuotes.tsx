import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { QuoteService } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface QuoteWithRelations {
  id: string;
  user_id: string;
  house_id: string;
  color_id: string;
  size_id: string;
  customizations: string[];
  total_price: number;
  status: 'pending' | 'approved' | 'rejected';
  message?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  houses: { name: string };
  colors: { name: string };
  sizes: { name: string };
  user_profiles: { first_name: string; last_name: string };
}

const AdminQuotes: React.FC = () => {
  const [quotes, setQuotes] = useState<QuoteWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      const data = await QuoteService.getAll();
      setQuotes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des devis:', error);
      toast.error('Erreur lors du chargement des devis');
    } finally {
      setLoading(false);
    }
  };

  const updateQuoteStatus = async (quoteId: string, newStatus: QuoteWithRelations['status']) => {
    try {
      await QuoteService.updateStatus(quoteId, newStatus);
      await loadQuotes(); // Recharger les données
      toast.success('Statut du devis mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusIcon = (status: QuoteWithRelations['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: QuoteWithRelations['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'approved':
        return 'Approuvé';
      case 'rejected':
        return 'Rejeté';
      default:
        return status;
    }
  };

  const getStatusColor = (status: QuoteWithRelations['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCustomizations = (customizations: string[]) => {
    const customizationLabels: { [key: string]: string } = {
      'solar': 'Panneaux solaires',
      'pool': 'Piscine intégrée',
      'garage': 'Garage attenant',
      'terrace': 'Terrasse étendue',
      'smart': 'Domotique avancée',
      'garden': 'Aménagement jardin'
    };

    return customizations.map(custom => customizationLabels[custom] || custom);
  };

  const filteredQuotes = selectedStatus === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.status === selectedStatus);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des devis</h1>
          <p className="text-gray-600">Traitez les demandes de devis des clients</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvés</option>
            <option value="rejected">Rejetés</option>
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: quotes.length, color: 'bg-gray-100' },
          { label: 'En attente', count: quotes.filter(q => q.status === 'pending').length, color: 'bg-yellow-100' },
          { label: 'Approuvés', count: quotes.filter(q => q.status === 'approved').length, color: 'bg-green-100' },
          { label: 'Rejetés', count: quotes.filter(q => q.status === 'rejected').length, color: 'bg-red-100' },
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-4`}>
            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Liste des devis */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Devis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Options
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#D{quote.id.padStart(3, '0')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {quote.user_profiles ? 
                        `${quote.user_profiles.first_name} ${quote.user_profiles.last_name}` : 
                        `Client #${quote.user_id}`
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {quote.houses?.name || `Maison #${quote.house_id}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {quote.colors?.name || `Couleur #${quote.color_id}`} • {quote.sizes?.name || `Taille #${quote.size_id}`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quote.customizations.length > 0 ? (
                        <div className="space-y-1">
                          {quote.customizations.map((custom, index) => (
                            <span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-1">
                              {custom}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-500">Aucune</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round(quote.total_price / 100).toLocaleString('fr-FR')}€
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(quote.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(quote.status)}`}>
                        {getStatusLabel(quote.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quote.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {quote.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateQuoteStatus(quote.id, 'approved')}
                            className="text-green-600 hover:text-green-700 transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateQuoteStatus(quote.id, 'rejected')}
                            className="text-red-600 hover:text-red-700 transition-colors"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button className="text-amber-600 hover:text-amber-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQuotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun devis trouvé</p>
          </div>
        )}
      </div>

      {/* Détails du message pour les devis en attente */}
      {filteredQuotes.filter(q => q.status === 'pending').length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages des clients</h3>
          <div className="space-y-4">
            {filteredQuotes.filter(q => q.status === 'pending').map((quote) => (
              <div key={quote.id} className="border-l-4 border-yellow-400 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Devis #D{quote.id.padStart(3, '0')}</span>
                 <span className="text-sm text-gray-500">
                   {quote.user_profiles ? 
                     `${quote.user_profiles.first_name} ${quote.user_profiles.last_name}` : 
                     `Client #${quote.user_id}`
                   }
                 </span>
                </div>
               <p className="text-gray-700 text-sm">{quote.message || 'Aucun message'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotes;