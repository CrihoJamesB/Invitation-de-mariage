import React from 'react';

/**
 * Composant Input réutilisable pour les formulaires
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.id - L'identifiant unique du champ
 * @param {string} [props.label] - Le libellé du champ
 * @param {string} [props.type='text'] - Le type de champ (text, email, password, etc.)
 * @param {string} [props.placeholder] - Le texte d'exemple
 * @param {boolean} [props.required=false] - Si le champ est obligatoire
 * @param {boolean} [props.disabled=false] - Si le champ est désactivé
 * @param {string} [props.error] - Message d'erreur à afficher
 * @param {string} [props.helperText] - Texte d'aide supplémentaire
 * @param {string} [props.className] - Classes CSS additionnelles
 * @param {Function} [props.onChange] - Fonction appelée lors du changement de valeur
 */
const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  error,
  helperText,
  className = '',
  onChange,
  ...props
}) => {
  // Classes pour le champ de saisie
  const inputClasses = `
    w-full px-4 py-2 rounded-md border 
    ${error ? 'border-error focus:ring-error' : 'border-gray-300 focus:ring-primary'}
    ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}
    focus:outline-none focus:ring-2 focus:ring-opacity-50
    transition-colors duration-200
    ${className}
  `;

  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className={`block mb-2 text-sm font-medium ${error ? 'text-error' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        onChange={onChange}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={helperText || error ? `${id}-description` : undefined}
        {...props}
      />
      
      {(helperText || error) && (
        <p 
          id={`${id}-description`} 
          className={`mt-1 text-sm ${error ? 'text-error' : 'text-gray-500'}`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 