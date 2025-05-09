import React from 'react';

/**
 * Composant de bouton réutilisable avec plusieurs variantes
 * @param {Object} props - Les propriétés du composant
 * @param {string} [props.variant='primary'] - La variante du bouton (primary, secondary, outline, text)
 * @param {string} [props.size='md'] - La taille du bouton (sm, md, lg)
 * @param {boolean} [props.fullWidth=false] - Si le bouton doit prendre toute la largeur disponible
 * @param {boolean} [props.disabled=false] - Si le bouton est désactivé
 * @param {React.ReactNode} props.children - Le contenu du bouton
 * @param {Function} [props.onClick] - La fonction à exécuter au clic
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  children,
  onClick,
  className = '',
  ...props
}) => {
  // Classes de base pour tous les boutons
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Classes spécifiques à la variante
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark focus:ring-primary',
    secondary: 'bg-secondary text-primary hover:bg-gray-100 focus:ring-secondary',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    text: 'text-primary hover:underline focus:ring-primary bg-transparent',
    success: 'bg-success text-white hover:bg-green-600 focus:ring-success',
    warning: 'bg-warning text-white hover:bg-amber-600 focus:ring-warning',
    error: 'bg-error text-white hover:bg-red-600 focus:ring-error',
  };
  
  // Classes spécifiques à la taille
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  // Classes pour la largeur
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Classes pour l'état désactivé
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combinaison de toutes les classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`;
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button; 