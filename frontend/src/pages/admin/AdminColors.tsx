import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Palette } from 'lucide-react';
import { ColorService, DatabaseColor } from '../../lib/supabase';
import toast from 'react-hot-toast';

const AdminColors: React.FC = () => {
  const [colors, setColors] = useState<DatabaseColor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingColor, setEditingColor] = useState<DatabaseColor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    hex: '#ffffff',
    price_modifier: 0
  });

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      const data = await ColorService.getAll();
      setColors(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des couleurs:', error);
      toast.error('Erreur lors du chargement des couleurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingColor) {
        await ColorService.update(editingColor.id, {
          name: formData.name,
          hex: formData.hex,
          price_modifier: Math.round(formData.price_modifier * 100) // Convertir en centimes
        });
        toast.success('Couleur modifiée avec succès');
      } else {
        await ColorService.create({
          name: formData.name,
          hex: formData.hex,
          price_modifier: Math.round(formData.price_modifier * 100) // Convertir en centimes
        });
        toast.success('Couleur ajoutée avec succès');
      }
      
      await loadColors(); // Recharger les données
      setShowForm(false);
      setFormData({ name: '', hex: '#ffffff', price_modifier: 0 });
      setEditingColor(null);
    } catch (error: any) {
  console.error('Erreur détaillée Supabase:', error.message || error);
  toast.error('Erreur lors de la sauvegarde');
}
  };

  const handleEdit = (color: DatabaseColor) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      hex: color.hex,
      price_modifier: Math.round(color.price_modifier / 100) // Convertir depuis les centimes
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette couleur ?')) {
      return;
    }

    try {
      await ColorService.delete(id);
      await loadColors(); // Recharger les données
      toast.success('Couleur supprimée avec succès');
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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des couleurs</h1>
          <p className="text-gray-600">Gérez les couleurs disponibles pour vos maisons</p>
        </div>
        <button
          onClick={() => {
            setEditingColor(null);
            setFormData({ name: '', hex: '#ffffff', price_modifier: 0 });
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Ajouter une couleur
        </button>
      </div>

      {/* Grille des couleurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colors.map((color) => (
          <div key={color.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{color.name}</h3>
                  <p className="text-sm text-gray-500">{color.hex}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(color)}
                  className="text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(color.id)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-gray-900">
                {color.price_modifier > 0 ? `+${Math.round(color.price_modifier / 100)}€` : 'Gratuit'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Formulaire modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingColor ? 'Modifier la couleur' : 'Ajouter une couleur'}
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
                  Nom de la couleur
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Ex: Bleu Océan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code couleur (hex)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.hex}
                    onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    required
                    value={formData.hex}
                    onChange={(e) => setFormData({ ...formData, hex: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="#ffffff"
                  />
                </div>
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
                  {editingColor ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminColors;