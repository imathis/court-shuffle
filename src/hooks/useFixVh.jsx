import React from 'react'
import { useDebouncedUiCallback } from './useDebounce'

const useFixVh = () => {
  const setVh = useDebouncedUiCallback(() => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  })

  if (screen?.orientation?.onchange) {
    screen.orientation.onchange = function () {
      setVh()
    }
  }

  React.useEffect(() => {
    setVh()
    const listener = window.addEventListener('resize', setVh);
    return () => {
      window.removeEventListener(listener, setVh)
    }
  })
}

export { useFixVh }
