import React, { useState } from 'react';
import { Eye, EyeOff, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminLoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'arifxhakan78@gmail.com', // Pré-rempli avec l'email admin
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setLoading(true);

    // Vérification que c'est bien l'email admin
    if (formData.email !== 'arifxhakan78@gmail.com') {
      setErrors(['Seul l\'administrateur peut accéder à cette section']);
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (success) {
          toast.success("Connexion administrateur réussie !");
          // Pas besoin de redirection, le composant AdminRoute va automatiquement afficher l'admin
        } else {
          setErrors(['Email ou mot de passe incorrect']);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setErrors(['Les mots de passe ne correspondent pas']);
          setLoading(false);
          return;
        }
        const success = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        });
        if (success) {
          toast.success("Compte administrateur créé !");
        } else {
          setErrors(['Erreur lors de la création du compte']);
        }
      }
    } catch (error: any) {
      setErrors([error.message || 'Une erreur est survenue']);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </button>
          
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            Administration
          </h2>
          <p className="text-white/80 text-lg">
            {isLogin ? 'Connectez-vous pour accéder au panel admin' : 'Créez votre compte administrateur'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.length > 0 && (
              <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-4 backdrop-blur-sm">
                <ul className="text-sm text-red-100">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                        Prénom
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                        Nom
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                        placeholder="Nom"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email administrateur
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  readOnly
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm cursor-not-allowed opacity-75"
                />
                <p className="text-white/60 text-xs mt-1">Email administrateur fixe</p>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
                    Téléphone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    placeholder="Téléphone"
                  />
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    placeholder="Mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-amber-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-700"></div>
                ) : (
                  isLogin ? 'Se connecter' : 'Créer le compte admin'
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-white/80 hover:text-white transition-colors text-sm underline"
              >
                {isLogin
                  ? 'Pas encore de compte admin ? Créez-le'
                  : 'Déjà un compte ? Connectez-vous'}
              </button>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-white/60 text-sm">
            🔒 Accès réservé à l'administrateur du site
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;