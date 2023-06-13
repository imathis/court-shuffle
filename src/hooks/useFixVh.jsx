import React from 'react'
import { useDebouncedUiCallback } from './useDebounce'

const useFixVh = () => {
  const setVh = useDebouncedUiCallback(() => {
    setTimeout(() => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }, 24)
  })

  React.useEffect(() => {
    setVh()
    const listener = window.addEventListener('resize', setVh);
    return () => {
      window.removeEventListener(listener, setVh)
    }
  })
}

export { useFixVh }
