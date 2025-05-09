import { useState, useEffect, useRef } from "react"

/**
 * Hook pour détecter quand un élément entre dans la vue et déclencher des animations
 *
 * @param {Object} options - Options pour l'Intersection Observer
 * @param {number} options.threshold - Seuil d'intersection (0-1) pour déclencher le callback
 * @param {string} options.rootMargin - Marge autour de la racine d'observation
 * @param {boolean} options.triggerOnce - Si l'observation doit se produire une seule fois
 * @returns {Array} [ref, isInView] - Référence à attacher à l'élément et état d'intersection
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px",
  triggerOnce = true,
} = {}) => {
  const [isInView, setIsInView] = useState(false)
  const elementRef = useRef(null)
  const observerRef = useRef(null)

  useEffect(() => {
    // Réinitialiser l'Intersection Observer uniquement si on a un nouvel élément à observer
    if (elementRef.current && !observerRef.current) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const isElementInView = entry.isIntersecting

          setIsInView(isElementInView)

          // Désinscrire après la première entrée en vue si triggerOnce est vrai
          if (isElementInView && triggerOnce && observerRef.current) {
            observerRef.current.disconnect()
          }
        },
        { threshold, rootMargin }
      )

      observerRef.current.observe(elementRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return [elementRef, isInView]
}

export default useIntersectionObserver
