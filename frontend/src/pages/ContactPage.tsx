import React, { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulation d'envoi
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border border-amber-200">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Message envoyé !</h2>
          <p className="text-amber-700 mb-6">
            Merci pour votre message. Nous vous contacterons dans les plus brefs délais.
          </p>
          <button
            onClick={() => onNavigate('home')}
            className="w-full px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center text-amber-700 hover:text-amber-800 mb-8 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour à l'accueil
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Nos coordonnées
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Adresse</h3>
                    <p className="text-amber-700">
                      123 Rue de l'Innovation<br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Téléphone</h3>
                    <p className="text-amber-700">01 23 45 67 89</p>
                    <p className="text-sm text-amber-600">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Email</h3>
                    <p className="text-amber-700">contact@containerhomes.fr</p>
                    <p className="text-sm text-amber-600">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Horaires</h3>
                    <p className="text-amber-700">
                      Lundi - Vendredi : 9h - 18h<br />
                      Samedi : 9h - 12h<br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
              <h3 className="text-xl font-bold text-amber-900 mb-4">Nous trouver</h3>
              <div className="w-full h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                <p className="text-amber-700">Carte interactive</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-amber-200">
            <h2 className="text-2xl font-bold text-amber-900 mb-6">
              Envoyez-nous un message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-amber-800 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-amber-800 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-800 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-amber-800 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="projectType" className="block text-sm font-medium text-amber-800 mb-2">
                  Type de projet
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Sélectionnez un type</option>
                  <option value="residential">Maison résidentielle</option>
                  <option value="commercial">Espace commercial</option>
                  <option value="office">Bureau</option>
                  <option value="vacation">Maison de vacances</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-amber-800 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-amber-800 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Décrivez votre projet ou posez vos questions..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5 mr-2" />
                Envoyer le message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;