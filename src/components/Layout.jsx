import React from 'react';

/**
 * Composant Layout principal pour structurer l'application
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Le contenu principal
 * @param {React.ReactNode} [props.header] - L'en-tête de la page
 * @param {React.ReactNode} [props.footer] - Le pied de la page
 * @param {string} [props.className] - Classes CSS additionnelles
 */
const Layout = ({
  children,
  header,
  footer,
  className = '',
  ...props
}) => {
  return (
    <div className={`min-h-screen flex flex-col ${className}`} {...props}>
      {/* En-tête */}
      {header && (
        <header className="bg-white shadow-soft">
          <div className="container mx-auto px-4 py-4">
            {header}
          </div>
        </header>
      )}
      
      {/* Contenu principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Pied de page */}
      {footer && (
        <footer className="bg-primary text-white">
          <div className="container mx-auto px-4 py-6">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
};

/**
 * Composant pour les sections de contenu
 */
Layout.Section = ({ children, title, subtitle, className = '', ...props }) => (
  <section className={`mb-12 ${className}`} {...props}>
    {title && (
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-primary mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

/**
 * Composant pour les conteneurs avec espacement
 */
Layout.Container = ({ children, className = '', ...props }) => (
  <div className={`p-6 bg-white rounded-lg shadow-soft ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Composant pour les grilles responsives
 */
Layout.Grid = ({ children, cols = 1, gap = 4, className = '', ...props }) => {
  // Classes pour définir le nombre de colonnes selon la taille d'écran
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  };
  
  // Classes pour définir l'espacement
  const gapClasses = {
    2: 'gap-2',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8',
  };
  
  return (
    <div 
      className={`grid ${colsClasses[cols] || colsClasses[1]} ${gapClasses[gap] || gapClasses[4]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Layout; 