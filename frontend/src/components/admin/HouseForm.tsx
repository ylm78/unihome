import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { X, Plus, Trash2 } from 'lucide-react';
import { DatabaseHouse } from '../../lib/supabase';

const schema = yup.object({
  name: yup.string().required('Le nom est requis'),
  description: yup.string().required('La description est requise'),
  short_description: yup.string().required('La description courte est requise'),
  base_price: yup.number().positive('Le prix doit être positif').required('Le prix est requis'),
  surface: yup.number().positive('La surface doit être positive').required('La surface est requise'),
  bedrooms: yup.number().min(0, 'Le nombre de chambres doit être positif ou nul').required('Le nombre de chambres est requis'),
  bathrooms: yup.number().min(0, 'Le nombre de salles de bain doit être positif ou nul').required('Le nombre de salles de bain est requis'),
  containers: yup.number().positive('Le nombre de containers doit être positif').required('Le nombre de containers est requis'),
  category: yup.string().oneOf(['residential', 'commercial', 'office', 'vacation']).required('La catégorie est requise'),
});

interface HouseFormProps {
  house?: DatabaseHouse;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const HouseForm: React.FC<HouseFormProps> = ({ house, onSubmit, onCancel, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: house ? {
      name: house.name,
      description: house.description,
      short_description: house.short_description,
      base_price: Math.round(house.base_price / 100), // Convertir depuis les centimes
      surface: house.surface,
      bedrooms: house.bedrooms,
      bathrooms: house.bathrooms,
      containers: house.containers,
      living_room: house.living_room,
      kitchen: house.kitchen,
      category: house.category,
      images: house.images.join('\n'),
      features: house.features.join('\n'),
    } : {
      living_room: true,
      kitchen: true,
      category: 'residential',
      images: '',
      features: '',
    }
  });

  const onFormSubmit = (data: any) => {
    const formattedData = {
      ...data,
      images: data.images.split('\n').filter((url: string) => url.trim()),
      features: data.features.split('\n').filter((feature: string) => feature.trim()),
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {house ? 'Modifier la maison' : 'Ajouter une maison'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la maison *
              </label>
              <input
                {...register('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Prix de base */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix de base (€) *
              </label>
              <input
                type="number"
                {...register('base_price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.base_price && (
                <p className="mt-1 text-sm text-red-600">{errors.base_price.message}</p>
              )}
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Surface (m²) *
              </label>
              <input
                type="number"
                {...register('surface')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.surface && (
                <p className="mt-1 text-sm text-red-600">{errors.surface.message}</p>
              )}
            </div>

            {/* Chambres */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de chambres *
              </label>
              <input
                type="number"
                {...register('bedrooms')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.bedrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
              )}
            </div>

            {/* Salles de bain */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de salles de bain *
              </label>
              <input
                type="number"
                {...register('bathrooms')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.bathrooms && (
                <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
              )}
            </div>

            {/* Containers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de containers *
              </label>
              <input
                type="number"
                {...register('containers')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.containers && (
                <p className="mt-1 text-sm text-red-600">{errors.containers.message}</p>
              )}
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                {...register('category')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="residential">Résidentiel</option>
                <option value="commercial">Commercial</option>
                <option value="office">Bureau</option>
                <option value="vacation">Vacances</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Options */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options
              </label>
              <div className="flex space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('living_room')}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Salon</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('kitchen')}
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Cuisine</span>
                </label>
              </div>
            </div>
          </div>

          {/* Description courte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description courte *
            </label>
            <input
              {...register('short_description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Description courte pour les cartes produit"
            />
            {errors.short_description && (
              <p className="mt-1 text-sm text-red-600">{errors.short_description.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description complète *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Description détaillée de la maison"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs des images (une par ligne)
            </label>
            <textarea
              {...register('images')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />
          </div>

          {/* Caractéristiques */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caractéristiques (une par ligne)
            </label>
            <textarea
              {...register('features')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Isolation thermique renforcée&#10;Baies vitrées panoramiques&#10;Terrasse en bois composite"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Enregistrement...' : house ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseForm;