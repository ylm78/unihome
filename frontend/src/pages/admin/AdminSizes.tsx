import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Ruler } from 'lucide-react';
import { SizeService, DatabaseSize } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AdminSizes: React.FC = () => {
  const [sizes, setSizes] = useState<DatabaseSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSize, setEditingSize] = useState<DatabaseSize | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dimensions: '',
    price_modifier: 0
  });

  useEffect(() => {
    loadSizes();
  }, []);

  const loadSizes = async () => {
    try {
      const data = await SizeService.getAll();
      setSizes(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tailles:', error);
      toast.error('Erreur lors du chargement des tailles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSize) {
        await SizeService.update(editingSize.id, {
          name: formData.name,
          dimensions: formData.dimensions,
          price_modifier: Math.round(formData.price_modifier * 100) // Convertir en centimes
        });
        toast.success('Taille modifiée avec succès');
      } else {
        await SizeService.create({
          name: formData.name,
          dimensions: formData.dimensions,
          price_modifier: Math.round(formData.price_modifier * 100) // Convertir en centimes
        });
        toast.success('Taille ajoutée avec succès');
      }
      
      await loadSizes(); // Recharger les données
      setShowForm(false);
      setFormData({ name: '', dimensions: '', price_modifier: 0 });
      setEditingSize(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleEdit = (size: DatabaseSize) => {
    setEditingSize(size);
    setFormData({
      name: size.name,
      dimensions: size.dimensions,
      price_modifier: Math.round(size.price_modifier / 100) // Convertir depuis les centimes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette taille ?')) {
      return;
    }

    try {
      await SizeService.delete(id);
      await loadSizes(); // Recharger les données
      toast.success('Taille supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des tailles</h1>
          <p className="text-gray-600">Gérez les tailles disponibles pour vos maisons</p>
        </div>
        <button
          onClick={() => {
            setEditingSize(null);
            setFormData({ name: '', dimensions: '', price_modifier: 0 });
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une taille
        </button>
      </div>

      {/* Liste des tailles */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dimensions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplément
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sizes.map((size) => (
                <tr key={size.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                        <Ruler className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{size.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {size.dimensions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {size.price_modifier > 0 ? `+${Math.round(size.price_modifier / 100).toLocaleString('fr-FR')}€` : 'Gratuit'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(size)}
                        className="text-amber-600 hover:text-amber-700 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(size.id)}
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
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingSize ? 'Modifier la taille' : 'Ajouter une taille'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la taille
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Standard"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  required
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: 12m x 2.5m"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplément de prix (€)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price_modifier}
                  onChange={(e) => setFormData({ ...formData, price_modifier: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingSize ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSizes;