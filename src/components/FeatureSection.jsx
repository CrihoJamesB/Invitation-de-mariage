import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * Composant pour afficher une section de fonctionnalités
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre de la section
 * @param {string} [props.subtitle] - Le sous-titre de la section
 * @param {Array} props.features - Un tableau d'objets représentant les fonctionnalités
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const FeatureSection = ({
  title,
  subtitle,
  features = [],
  className = '',
}) => {
  return (
    <section className={`py-12 md:py-20 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        {/* En-tête de la section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600">{subtitle}</p>
          )}
        </div>
        
        {/* Grille de fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

/**
 * Composant pour afficher une fonctionnalité individuelle
 */
const FeatureCard = ({ icon, title, description }) => {
  return (
    <Card 
      variant="elevated" 
      className="h-full hover-lift"
      hoverable
    >
      <Card.Body className="flex flex-col items-center text-center p-6">
        {/* Icône */}
        {icon && (
          <div className="w-16 h-16 flex items-center justify-center bg-primary-light/10 text-primary rounded-full mb-4">
            {icon}
          </div>
        )}
        
        {/* Titre */}
        <h3 className="text-xl font-semibold text-primary mb-3">{title}</h3>
        
        {/* Description */}
        <p className="text-gray-600">{description}</p>
      </Card.Body>
    </Card>
  );
};

// Validation des propriétés
FeatureSection.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  features: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
  className: PropTypes.string,
};

FeatureCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default FeatureSection; 