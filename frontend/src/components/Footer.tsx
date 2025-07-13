import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Home } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-3">
                <Home className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">ContainerHomes</h3>
            </div>
            <p className="text-amber-100">
              Spécialiste des maisons en container sur mesure. Nous créons des habitats innovants, 
              écologiques et durables pour tous vos projets.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors hover:scale-110" />
              <Instagram className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors hover:scale-110" />
              <Twitter className="w-5 h-5 text-amber-200 hover:text-white cursor-pointer transition-colors hover:scale-110" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navigation</h3>
            <ul className="space-y-2 text-amber-100">
              <li><button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">Accueil</button></li>
              <li><button onClick={() => onNavigate('catalog')} className="hover:text-white transition-colors">Catalogue</button></li>
              <li><button onClick={() => onNavigate('build')} className="hover:text-white transition-colors">Construire</button></li>
              <li><button onClick={() => onNavigate('faq')} className="hover:text-white transition-colors">FAQ</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Nos produits</h3>
            <ul className="space-y-2 text-amber-100">
              <li><a href="#" className="hover:text-white transition-colors">Maisons résidentielles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bureaux mobiles</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Espaces commerciaux</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chalets de vacances</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-amber-100">
                <MapPin className="w-4 h-4" />
                <span>123 Rue de l'Innovation, 75001 Paris</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-100">
                <Phone className="w-4 h-4" />
                <span>01 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-100">
                <Mail className="w-4 h-4" />
                <span>contact@containerhomes.fr</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-200">
          <p>&copy; 2024 ContainerHomes. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;