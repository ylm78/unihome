import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, HelpCircle, Search } from 'lucide-react';

interface FAQPageProps {
  onNavigate: (page: string) => void;
}

const FAQPage: React.FC<FAQPageProps> = ({ onNavigate }) => {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const faqData = [
    {
      id: 'price',
      category: 'Prix et financement',
      question: 'Quel est le prix d\'une maison container ?',
      answer: 'Le prix varie selon la taille, les finitions et les options choisies. Comptez entre 28 000€ pour un studio et 89 000€ pour une villa familiale. Ce prix inclut la livraison et l\'installation de base.'
    },
    {
      id: 'delivery',
      category: 'Livraison',
      question: 'Quels sont les délais de livraison ?',
      answer: 'Nos délais de livraison sont de 6 à 8 semaines après validation de votre commande et obtention des autorisations nécessaires. Ce délai peut varier selon la complexité du projet.'
    },
    {
      id: 'permits',
      category: 'Réglementation',
      question: 'Faut-il un permis de construire ?',
      answer: 'Oui, un permis de construire est obligatoire pour toute construction de plus de 20m². Pour les constructions plus petites, une déclaration préalable de travaux suffit.'
    },
    {
      id: 'insulation',
      category: 'Technique',
      question: 'Comment est assurée l\'isolation ?',
      answer: 'Nous utilisons une isolation thermique renforcée avec des matériaux haute performance. L\'isolation est réalisée par l\'intérieur et l\'extérieur pour garantir un confort optimal été comme hiver.'
    },
    {
      id: 'warranty',
      category: 'Garantie',
      question: 'Quelle garantie proposez-vous ?',
      answer: 'Nous offrons une garantie de 10 ans sur la structure et 2 ans sur les équipements. Cette garantie couvre les défauts de fabrication et les vices cachés.'
    },
    {
      id: 'customization',
      category: 'Personnalisation',
      question: 'Peut-on personnaliser les maisons ?',
      answer: 'Absolument ! Nous proposons de nombreuses options de personnalisation : couleurs, tailles, aménagements intérieurs, équipements supplémentaires. Chaque projet est unique.'
    },
    {
      id: 'foundation',
      category: 'Installation',
      question: 'Quel type de fondation est nécessaire ?',
      answer: 'Selon le terrain, nous proposons différentes solutions : plots béton, semelle filante ou radier. Une étude de sol préalable détermine la solution optimale pour votre projet.'
    },
    {
      id: 'utilities',
      category: 'Raccordements',
      question: 'Comment se fait le raccordement aux réseaux ?',
      answer: 'Nous coordonnons tous les raccordements : électricité, eau, assainissement, télécommunications. Ces prestations peuvent être incluses dans votre devis selon vos besoins.'
    },
    {
      id: 'maintenance',
      category: 'Entretien',
      question: 'Quel entretien pour une maison container ?',
      answer: 'L\'entretien est minimal : nettoyage régulier des façades, vérification de l\'étanchéité, entretien des équipements. La structure en acier est très résistante et durable.'
    },
    {
      id: 'financing',
      category: 'Financement',
      question: 'Proposez-vous des solutions de financement ?',
      answer: 'Nous travaillons avec plusieurs partenaires bancaires pour vous proposer des solutions de financement adaptées. Un crédit immobilier classique peut financer votre projet.'
    }
  ];

  const categories = [...new Set(faqData.map(item => item.category))];

  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
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
          <HelpCircle className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Questions Fréquentes
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos maisons containers
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 w-5 h-5 text-amber-400" />
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(category => (
            <span
              key={category}
              className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium"
            >
              {category}
            </span>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQ.map((item) => {
            const isOpen = openQuestion === item.id;
            
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-amber-50 transition-colors"
                >
                  <div>
                    <div className="text-sm text-amber-600 font-medium mb-1">
                      {item.category}
                    </div>
                    <h3 className="text-lg font-semibold text-amber-900">
                      {item.question}
                    </h3>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6">
                    <p className="text-amber-800 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="text-center py-12">
            <p className="text-amber-600 text-lg">
              Aucune question ne correspond à votre recherche.
            </p>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-xl mb-6">
            Notre équipe est là pour répondre à toutes vos questions
          </p>
          <button
            onClick={() => onNavigate('contact')}
            className="px-8 py-3 bg-white text-amber-700 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;