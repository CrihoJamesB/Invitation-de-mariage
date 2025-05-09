import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Composant Hero pour la page d'accueil
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Le titre principal
 * @param {string} [props.subtitle] - Le sous-titre 
 * @param {string} [props.imageSrc] - L'URL de l'image d'arrière-plan
 * @param {string} [props.imageAlt] - Le texte alternatif pour l'image
 * @param {string} [props.primaryButtonText] - Le texte du bouton principal
 * @param {Function} [props.onPrimaryButtonClick] - L'action du bouton principal
 * @param {string} [props.secondaryButtonText] - Le texte du bouton secondaire
 * @param {Function} [props.onSecondaryButtonClick] - L'action du bouton secondaire
 */
const Hero = ({
  title,
  subtitle,
  imageSrc,
  imageAlt = "Image bannière",
  primaryButtonText,
  onPrimaryButtonClick,
  secondaryButtonText,
  onSecondaryButtonClick,
}) => {
  return (
    <div className="relative overflow-hidden bg-gray-50">
      {/* Fond décoratif avec gradient */}
      <div 
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary opacity-10 z-0"
      />
      
      {/* Contenu principal */}
      <div className="relative container mx-auto px-4 py-16 md:py-24 lg:py-32 flex flex-col lg:flex-row items-center gap-12 z-10">
        {/* Texte */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
              {subtitle}
            </p>
          )}
          
          {/* Boutons d'action */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            {primaryButtonText && (
              <Button 
                variant="primary" 
                size="lg"
                onClick={onPrimaryButtonClick}
              >
                {primaryButtonText}
              </Button>
            )}
            
            {secondaryButtonText && (
              <Button 
                variant="outline" 
                size="lg"
                onClick={onSecondaryButtonClick}
              >
                {secondaryButtonText}
              </Button>
            )}
          </div>
        </div>
        
        {/* Image */}
        {imageSrc && (
          <div className="lg:w-1/2">
            <div className="relative rounded-lg overflow-hidden shadow-hard">
              <img 
                src={imageSrc} 
                alt={imageAlt}
                className="w-full h-auto object-cover"
              />
              {/* Superposition avec effet de brillance */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Validation des propriétés
Hero.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  primaryButtonText: PropTypes.string,
  onPrimaryButtonClick: PropTypes.func,
  secondaryButtonText: PropTypes.string,
  onSecondaryButtonClick: PropTypes.func,
};

export default Hero; 