import React from 'react'
import { useDebouncedUiCallback } from './useDebounce'

const useFixVh = () => {
  const setVh = useDebouncedUiCallback((type) => {
    console.log(type)
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  })

  if (screen?.orientation?.onchange) {
    screen.orientation.onchange = function () {
      setVh('orientation change')
    }
  }

  React.useEffect(() => {
    setVh('iniital')
    const resized = () => setVh('resized')
    const listener = window.addEventListener('resize', resized);
    return () => {
      window.removeEventListener(listener, resized)
    }
  })
}

export { useFixVh }
