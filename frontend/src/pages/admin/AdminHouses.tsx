import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react';
import { HouseService, DatabaseHouse } from '../../lib/supabase';
import HouseForm from '../../components/admin/HouseForm';
import toast from 'react-hot-toast';

const AdminHouses: React.FC = () => {
  const [houses, setHouses] = useState<DatabaseHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHouse, setEditingHouse] = useState<DatabaseHouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadHouses();
  }, []);

  const loadHouses = async () => {
    try {
      const data = await HouseService.getAll();
      setHouses(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des maisons:', error);
      toast.error('Erreur lors du chargement des maisons');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHouse = () => {
    setEditingHouse(null);
    setShowForm(true);
  };

  const handleEditHouse = (house: DatabaseHouse) => {
    setEditingHouse(house);
    setShowForm(true);
  };

  const handleDeleteHouse = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette maison ?')) {
      return;
    }

    try {
      await HouseService.delete(id);
      await loadHouses(); // Recharger les données
      toast.success('Maison supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSubmitForm = async (data: any) => {
    setFormLoading(true);
    try {
      if (editingHouse) {
        await HouseService.update(editingHouse.id, {
          ...data,
          base_price: Math.round(data.base_price * 100) // Convertir en centimes
        });
        toast.success('Maison modifiée avec succès');
      } else {
        await HouseService.create({
          ...data,
          base_price: Math.round(data.base_price * 100) // Convertir en centimes
        });
        toast.success('Maison ajoutée avec succès');
      }
      await loadHouses(); // Recharger les données
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredHouses = houses.filter(house =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    house.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des maisons</h1>
          <p className="text-gray-600">Gérez votre catalogue de maisons containers</p>
        </div>
        <button
          onClick={handleAddHouse}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une maison
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une maison..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        />
      </div>

      {/* Liste des maisons */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Maison
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spécifications
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHouses.map((house) => (
                <tr key={house.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={house.images[0]}
                        alt={house.name}
                        className="w-12 h-12 rounded-lg object-cover mr-4"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{house.name}</div>
                        <div className="text-sm text-gray-500">{house.short_description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      house.category === 'residential' ? 'bg-green-100 text-green-800' :
                      house.category === 'commercial' ? 'bg-blue-100 text-blue-800' :
                      house.category === 'office' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {house.category === 'residential' ? 'Résidentiel' :
                       house.category === 'commercial' ? 'Commercial' :
                       house.category === 'office' ? 'Bureau' : 'Vacances'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {Math.round(house.base_price / 100).toLocaleString('fr-FR')}€
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {house.surface}m² • {house.bedrooms} ch. • {house.bathrooms} sdb
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditHouse(house)}
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteHouse(house.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredHouses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune maison trouvée</p>
          </div>
        )}
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <HouseForm
          house={editingHouse || undefined}
          onSubmit={handleSubmitForm}
          onCancel={() => setShowForm(false)}
          isLoading={formLoading}
        />
      )}
    </div>
  );
};

export default AdminHouses;