import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

// This helper function can now be private to the hook's module
const getInitialIndex = (searchParams: URLSearchParams, imageCount: number): number => {
  const param = searchParams.get('imgIndex')
  if (param) {
    const index = parseInt(param, 10)
    if (!isNaN(index) && index >= 0 && index < imageCount) {
      return index
    }
  }
  return 0
}

export const useSyncedImageIndex = (imageCount: number) => {
  const searchParams = useSearchParams()

  // Initialize state using the helper function
  const [imgIndex, setImgIndex] = useState(() => getInitialIndex(searchParams, imageCount))

  // This effect syncs the state back to the URL's query params
  useEffect(() => {
    // We get the current path and create a new params object
    const currentPath = window.location.pathname
    const newParams = new URLSearchParams(window.location.search)
    newParams.set('imgIndex', String(imgIndex))

    // Use replaceState to update the URL without a page reload
    window.history.replaceState(null, '', `${currentPath}?${newParams.toString()}`)
  }, [imgIndex])

  return [imgIndex, setImgIndex] as const
}
