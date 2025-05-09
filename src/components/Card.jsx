import React from 'react';

/**
 * Composant Card réutilisable pour afficher du contenu encadré
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu de la carte
 * @param {string} [props.variant='default'] - La variante de la carte (default, outlined, elevated)
 * @param {boolean} [props.hoverable=false] - Si la carte doit avoir un effet au survol
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Card = ({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  // Classes de base pour toutes les cartes
  const baseClasses = 'rounded-lg overflow-hidden';
  
  // Classes spécifiques à la variante
  const variantClasses = {
    default: 'bg-white',
    outlined: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-medium',
  };
  
  // Classes pour l'effet au survol
  const hoverClasses = hoverable ? 'transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-hard' : '';
  
  // Combinaison de toutes les classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;
  
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Composant pour l'en-tête de la carte
 */
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Composant pour le corps de la carte
 */
Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Composant pour le pied de la carte
 */
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

export default Card; 