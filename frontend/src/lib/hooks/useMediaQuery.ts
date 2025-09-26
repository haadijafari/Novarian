'use client'

import { useState, useEffect } from 'react'

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // The window.matchMedia API is the core of this hook.
    // It returns a MediaQueryList object that we can use to check the query
    // and listen for changes.
    const mediaQueryList = window.matchMedia(query)

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // We set the initial state here inside the effect, which only runs on the client.
    // This avoids a hydration mismatch between the server-rendered HTML (where
    // `matches` is always `false`) and the client-rendered HTML.
    setMatches(mediaQueryList.matches)

    mediaQueryList.addEventListener('change', handleChange)

    return () => {
      mediaQueryList.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

export default useMediaQuery
