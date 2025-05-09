import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { invitationInfo } from "../data/invitationInfo"
import RevealOnScroll from "../components/common/RevealOnScroll"

/**
 * Page d&apos;atterrissage optimisée pour SEO et partage des invitations
 * Cette page est accessible publiquement sans ID d&apos;invité
 */
const LandingPage = () => {
  // État pour stocker les messages d'erreur d'authentification
  const [authMessage, setAuthMessage] = useState("")

  // Optimisations SEO
  useEffect(() => {
    document.title = `Mariage de ${invitationInfo.couple.groom} & ${invitationInfo.couple.bride} - ${invitationInfo.event.date}`

    // Mise à jour des métadonnées pour optimiser le partage sur les réseaux sociaux
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        `Nous avons l'immense joie de vous convier au mariage de ${invitationInfo.couple.groom} & ${invitationInfo.couple.bride} qui aura lieu le ${invitationInfo.event.date} à ${invitationInfo.event.venue}.`
      )
    }

    // Vérification des messages d'authentification
    const storedMessage = localStorage.getItem("authMessage")
    if (storedMessage) {
      setAuthMessage(storedMessage)
      // Supprimer le message après l'avoir affiché
      localStorage.removeItem("authMessage")

      // Faire disparaître le message après 5 secondes
      const timer = setTimeout(() => {
        setAuthMessage("")
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      {/* Message d'alerte pour l'authentification */}
      {authMessage && (
        <div className="fixed top-4 left-0 right-0 mx-auto max-w-md z-50 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg animate-fadeIn">
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="w-6 h-6 mr-4 fill-current text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
            </div>
            <div>
              <p className="text-sm">{authMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* En-tête avec fond décoratif */}
      <header className="relative h-80 sm:h-96 bg-primary/10 overflow-hidden">
        <div className="absolute inset-0 bg-floral-pattern opacity-20"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <RevealOnScroll
            animation="fade-down"
            delay={100}
          >
            <h1 className="text-primary font-elegant text-3xl sm:text-4xl md:text-5xl text-center">
              Mariage de
            </h1>
          </RevealOnScroll>

          {/* Disposition améliorée des noms */}
          <RevealOnScroll
            animation="fade-up"
            delay={300}
          >
            <div className="mt-6 sm:mt-8 relative w-full px-4 max-w-4xl mx-auto">
              <div className="names-container flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 flex-wrap">
                <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-primary text-center break-words">
                  {invitationInfo.couple.groom}
                </span>
                <div className="wedding-ampersand my-2 sm:my-0">
                  <span className="wedding-symbol text-3xl sm:text-4xl md:text-5xl text-gradient">
                    &
                  </span>
                </div>
                <span className="font-cursive text-4xl sm:text-5xl md:text-6xl text-primary text-center break-words">
                  {invitationInfo.couple.bride}
                </span>
              </div>
              <div className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            animation="fade-up"
            delay={500}
          >
            <p className="mt-8 text-muted font-sans text-lg sm:text-xl border-t border-primary/10 pt-4 px-6 rounded-full bg-white/30 shadow-sm">
              {invitationInfo.event.date}
            </p>
          </RevealOnScroll>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 px-4 py-10 max-w-4xl mx-auto">
        <RevealOnScroll
          className="mb-8 text-center"
          delay={100}
        >
          <div className="glass-card p-6 sm:p-8 rounded-xl">
            <h2 className="font-elegant text-2xl sm:text-3xl text-primary-dark mb-4">
              Notre invitation
            </h2>
            <p className="text-muted mb-4 max-w-2xl mx-auto">
              {invitationInfo.welcomeMessage}
            </p>
            <p className="text-sm text-primary-dark/70 italic">
              Veuillez utiliser votre lien d&apos;invitation personnalisé pour
              accéder à tous les détails.
            </p>
          </div>
        </RevealOnScroll>

        {/* Sections d&apos;informations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <RevealOnScroll
            animation="fade-right"
            delay={200}
          >
            <div className="card p-5 sm:p-7 hover:shadow-lg transition-shadow">
              <h3 className="font-elegant text-xl text-primary-dark mb-3">
                Date & Horaire
              </h3>
              <p className="text-muted">
                Le {invitationInfo.event.date} à {invitationInfo.event.time}
              </p>
              <div className="mt-3 bg-accent/10 rounded-lg p-3 text-sm text-center text-accent border-l-2 border-accent">
                <span className="font-medium">
                  Accueil des invités à partir de 19h
                </span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            animation="fade-left"
            delay={300}
          >
            <div className="card p-5 sm:p-7 hover:shadow-lg transition-shadow">
              <h3 className="font-elegant text-xl text-primary-dark mb-3">
                Lieu
              </h3>
              <p className="text-muted">
                {invitationInfo.event.venue}
                <br />
                {invitationInfo.event.address}
                <br />
                {invitationInfo.event.location}
              </p>
            </div>
          </RevealOnScroll>
        </div>

        {/* Demande d&apos;accès */}
        <RevealOnScroll
          animation="zoom-in"
          delay={400}
        >
          <div className="text-center mt-8 mb-12 glass-card p-6 sm:p-8 rounded-xl">
            <h2 className="font-elegant text-2xl sm:text-3xl text-primary-dark mb-4">
              Comment accéder à votre invitation personnalisée
            </h2>
            <p className="text-muted mb-6">
              L&apos;invitation complète est accessible uniquement via le lien
              personnalisé qui vous a été envoyé. Si vous ne l&apos;avez pas
              reçu, veuillez contacter les mariés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/admin-login"
                className="px-6 py-3 bg-primary text-white rounded-lg shadow-elegant hover:bg-primary-dark transition-all transform hover:-translate-y-1"
              >
                Accéder à l&apos;administration
              </Link>
              <a
                href={`mailto:${invitationInfo.rsvp.contactEmail}`}
                className="px-6 py-3 bg-white text-primary-dark border border-primary/20 rounded-lg shadow-elegant hover:bg-highlight transition-all transform hover:-translate-y-1"
              >
                Contacter les mariés
              </a>
            </div>
          </div>
        </RevealOnScroll>
      </main>

      {/* Pied de page */}
      <footer className="bg-primary text-white py-8 px-4 text-center">
        <div className="mb-4">
          <RevealOnScroll animation="fade-up">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="font-cursive text-2xl">
                {invitationInfo.couple.groom}
              </span>
              <span className="text-xl">&</span>
              <span className="font-cursive text-2xl">
                {invitationInfo.couple.bride}
              </span>
            </div>
          </RevealOnScroll>
        </div>
        <p className="text-sm text-white/70">
          Nous nous réjouissons de célébrer ce jour spécial avec vous
        </p>
        <div className="mt-6 text-xs text-white/50">
          <p>© {new Date().getFullYear()} - Tous droits réservés</p>
        </div>
      </footer>

      <style>{`
        .text-gradient {
          background-image: linear-gradient(to right, var(--color-primary), var(--color-accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .wedding-symbol {
          display: inline-block;
        }
        .shadow-elegant {
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
        }
        
        /* Animation pour les messages d'alerte */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  )
}

export default LandingPage
