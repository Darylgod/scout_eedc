// src/hooks/useScrollReveal.js - Version simplifiée
import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    // Fonction pour observer tous les éléments .reveal
    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal')
      elements.forEach(el => observer.observe(el))
    }

    // Observer les éléments existants
    observeElements()

    // Observer les nouveaux éléments ajoutés dynamiquement
    const mutationObserver = new MutationObserver(() => {
      // Ne réobserver que les éléments qui ne sont pas déjà observés
      const elements = document.querySelectorAll('.reveal')
      elements.forEach(el => {
        // Vérifier si l'élément n'est pas déjà observé
        if (!el.hasAttribute('data-observed')) {
          observer.observe(el)
          el.setAttribute('data-observed', 'true')
        }
      })
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])
}