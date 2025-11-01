/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    
    const mediaQueryList = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Adiciona o listener
    try {
      mediaQueryList.addEventListener('change', listener);
    } catch (e) {
      // Fallback para navegadores mais antigos
      mediaQueryList.addListener(listener);
    }
    
    // Sincroniza o estado inicial
    if (mediaQueryList.matches !== matches) {
      setMatches(mediaQueryList.matches);
    }

    // Limpa o listener ao desmontar
    return () => {
      try {
        mediaQueryList.removeEventListener('change', listener);
      } catch (e) {
        // Fallback para navegadores mais antigos
        mediaQueryList.removeListener(listener);
      }
    };
  }, [query, matches]);

  return matches;
};