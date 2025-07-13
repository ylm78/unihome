import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
  users?: {
    email: string;
    last_sign_in_at?: string;
  };
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          users:id (
            email,
            last_sign_in_at
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
      await loadUsers(); // Recharger les données
      toast.success('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      await loadUsers(); // Recharger les données
      toast.success('Rôle utilisateur mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.first_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.last_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.users?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
          <UserPlus className="w-5 h-5 mr-2" />
          Ajouter un utilisateur
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="all">Tous les rôles</option>
          <option value="user">Utilisateurs</option>
          <option value="admin">Administrateurs</option>
        </select>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total utilisateurs', count: users.length, color: 'bg-blue-100' },
          { label: 'Utilisateurs', count: users.filter(u => u.role === 'user').length, color: 'bg-green-100' },
          { label: 'Administrateurs', count: users.filter(u => u.role === 'admin').length, color: 'bg-purple-100' },
        ].map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-4`}>
            <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-amber-600 font-medium">
                          {(user.first_name || 'U').charAt(0)}{(user.last_name || 'U').charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name || 'Prénom'} {user.last_name || 'Nom'}
                        </div>
                        <div className="text-sm text-gray-500">{user.users?.email || 'Email non disponible'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="w-4 h-4 mr-1" />
                          {user.phone}
                        </div>
                      )}
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.users?.email || 'Email non disponible'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as 'user' | 'admin')}
                      className={`text-xs border rounded px-2 py-1 focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 border-purple-300' 
                          : 'bg-green-100 text-green-800 border-green-300'
                      }`}
                    >
                      <option value="user">Utilisateur</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.users?.last_sign_in_at 
                      ? new Date(user.users.last_sign_in_at).toLocaleDateString('fr-FR')
                      : 'Jamais'
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-amber-600 hover:text-amber-700 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-700 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;