import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, FileText, Building, MapPin, Hammer, Zap, Users } from 'lucide-react';

interface BuildPageProps {
  onNavigate: (page: string) => void;
}

const BuildPage: React.FC<BuildPageProps> = ({ onNavigate }) => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const sections = [
    {
      id: 'why',
      title: 'Pourquoi construire en containers ?',
      icon: Building,
      content: `
        Les maisons containers offrent de nombreux avantages : construction rapide, coût maîtrisé, 
        respect de l'environnement grâce au recyclage, et design moderne. Elles sont également 
        modulaires et peuvent être facilement agrandies ou déplacées selon vos besoins.
      `
    },
    {
      id: 'plu',
      title: 'Le plan local d\'urbanisme d\'une maison en conteneurs maritimes',
      icon: MapPin,
      content: `
        Avant tout projet, il est essentiel de consulter le PLU de votre commune. Certaines zones 
        peuvent avoir des restrictions spécifiques concernant l'architecture ou les matériaux. 
        Nous vous accompagnons dans cette démarche pour garantir la conformité de votre projet.
      `
    },
    {
      id: 'certificate',
      title: 'Le certificat d\'urbanisme pour un conteneur habitable',
      icon: FileText,
      content: `
        Le certificat d'urbanisme vous informe sur les règles d'urbanisme applicables à votre terrain. 
        Il existe deux types : le certificat d'information et le certificat opérationnel. 
        Ce document est gratuit et valable 18 mois.
      `
    },
    {
      id: 'permit',
      title: 'Le permis de construire pour une maison conteneur',
      icon: Building,
      content: `
        Un permis de construire est obligatoire pour toute construction de plus de 20m². 
        Pour les maisons containers, le dossier doit inclure les plans, l'insertion paysagère, 
        et les spécifications techniques. Le délai d'instruction est de 2 à 3 mois.
      `
    },
    {
      id: 'declaration',
      title: 'La déclaration de travaux de votre maison container',
      icon: Hammer,
      content: `
        Pour les constructions de moins de 20m², une déclaration préalable de travaux suffit. 
        Cette procédure simplifiée permet d'obtenir une autorisation plus rapidement, 
        généralement sous 1 mois.
      `
    },
    {
      id: 'foundations',
      title: 'Les fondations de la maison container',
      icon: Building,
      content: `
        Les fondations sont cruciales pour la stabilité de votre maison container. 
        Plusieurs options existent : plots béton, semelle filante, ou radier selon le terrain. 
        Une étude de sol préalable est recommandée pour choisir la solution optimale.
      `
    },
    {
      id: 'utilities',
      title: 'Raccordement et viabilisation d\'un conteneur habitable',
      icon: Zap,
      content: `
        Le raccordement aux réseaux (électricité, eau, assainissement, télécommunications) 
        est une étape clé. Nous coordonnons avec les différents fournisseurs pour assurer 
        une viabilisation complète et conforme aux normes.
      `
    },
    {
      id: 'steps',
      title: '10 étapes clés de la construction en container',
      icon: Building,
      content: `
        1. Étude de faisabilité et choix du terrain
        2. Conception et plans architecturaux
        3. Dépôt des autorisations d'urbanisme
        4. Préparation du terrain et fondations
        5. Livraison et positionnement des containers
        6. Découpes et ouvertures
        7. Isolation et étanchéité
        8. Raccordements techniques
        9. Aménagements intérieurs
        10. Finitions et livraison
      `
    },
    {
      id: 'roles',
      title: 'Construction en container : qui fait quoi ?',
      icon: Users,
      content: `
        Notre équipe pluridisciplinaire comprend : architectes pour la conception, 
        bureaux d'études pour les calculs, entreprises spécialisées pour la transformation, 
        et coordinateurs pour le suivi. Chaque intervenant a un rôle précis pour garantir 
        la réussite de votre projet.
      `
    },
    {
      id: 'formalities',
      title: 'Construire sa maison container : quelles formalités ?',
      icon: FileText,
      content: `
        Les principales formalités incluent : consultation du PLU, demande de certificat d'urbanisme, 
        dépôt de permis de construire ou déclaration de travaux, déclaration d'ouverture de chantier, 
        et déclaration d'achèvement des travaux. Nous vous accompagnons dans toutes ces démarches.
      `
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            Guide de Construction
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Tout ce que vous devez savoir pour construire votre maison container
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const IconComponent = section.icon;
            const isOpen = openSection === section.id;
            
            return (
              <div
                key={section.id}
                className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900">
                      {section.title}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-amber-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-amber-600" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="pl-16">
                      <p className="text-amber-800 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'accompagnement ?
          </h2>
          <p className="text-xl mb-6">
            Notre équipe d'experts vous guide à chaque étape de votre projet
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('contact')}
              className="px-8 py-3 bg-white text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
            >
              Nous contacter
            </button>
            <button
              onClick={() => onNavigate('quote')}
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-amber-700 transition-colors"
            >
              Demander un devis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuildPage;