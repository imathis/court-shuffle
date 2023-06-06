import { useCallback, useEffect, useRef } from 'react'

const useDebouncedCallback = (callback, deps = [], delay = 250) => {
  const timeoutRef = useRef()
  const callbackRef = useRef(callback)
  const lastCalledRef = useRef(0)

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useCallback's deps, it will also update, but it
  // might be called twice if the timeout had already been set.

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Clear timeout if the components is unmounted or the delay changes:
  useEffect(() => window.clearTimeout(timeoutRef.current), [...deps, delay])

  return useCallback((...args) => {
    // Clear previous timer:
    window.clearTimeout(timeoutRef.current)

    const invoke = () => {
      callbackRef.current(...args)
      lastCalledRef.current = Date.now()
    }

    // Calculate elapsed time:
    const elapsed = Date.now() - lastCalledRef.current

    // If already waited enough, call callback:
    if (elapsed >= delay) invoke()
    // Otherwise, we need to wait a bit more:
    else timeoutRef.current = window.setTimeout(invoke, delay - elapsed)
  }, [...deps, callback])
}

const useDelayedDebouncedCallback = (callback, deps = [], delay = 250) => {
  const timeoutRef = useRef()
  const callbackRef = useRef(callback)
  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useCallback's deps, it will also update, but it
  // might be called twice if the timeout had already been set.

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Clear timeout if the components is unmounted or the delay changes:
  useEffect(() => window.clearTimeout(timeoutRef.current), [...deps, delay])

  const cb = useCallback((...args) => {
    // Clear previous timer:
    window.clearTimeout(timeoutRef.current)

    const invoke = () => {
      callbackRef.current(...args)
    }

    timeoutRef.current = window.setTimeout(invoke, delay)
  }, [...deps, callback])

  cb.cancel = () => window.clearTimeout(timeoutRef.current)

  return cb
}

const useQueuedDebouncedCallback = (callback, deps = [], delay = 250) => {
  const timeoutRef = useRef()
  const callbackStack = useRef([])

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useCallback's deps, it will also update, but it
  // might be called twice if the timeout had already been set.

  // Clear timeout if the components is unmounted or the delay changes:
  useEffect(() => window.clearTimeout(timeoutRef.current), [delay])

  return useCallback((...args) => {
    // Clear previous timer:
    window.clearTimeout(timeoutRef.current)

    callbackStack.current.push(() => callback(...args))

    const invoke = () => {
      callbackStack.current.forEach((cb) => cb())
      callbackStack.current = []
    }

    timeoutRef.current = window.setTimeout(invoke, delay)
  }, [...deps, callback])
}

const useDebouncedUiCallback = (callback, deps = [], delay = 250) => {
  const timeoutRef = useRef()
  const callbackRef = useRef(callback)
  const lastCalledRef = useRef(0)

  // Remember the latest callback:
  //
  // Without this, if you change the callback, when setTimeout kicks in, it
  // will still call your old callback.
  //
  // If you add `callback` to useCallback's deps, it will also update, but it
  // might be called twice if the timeout had already been set.

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Clear timeout if the components is unmounted or the delay changes:
  useEffect(() => window.cancelAnimationFrame(timeoutRef.current), [delay])

  return useCallback((...args) => {
    // Clear previous timer:
    window.cancelAnimationFrame(timeoutRef.current)

    const invoke = () => {
      callbackRef.current(...args)
      lastCalledRef.current = Date.now()
    }

    const loop = () => {
      // Calculate elapsed time:
      const elapsed = Date.now() - lastCalledRef.current

      // If already waited enough, call callback:
      if (delay <= elapsed) invoke()
      // Otherwise queue up callback for another frame
      else timeoutRef.current = window.requestAnimationFrame(loop)
    }

    loop()
  }, [...deps, callback])
}

export {
  useDebouncedCallback,
  useDebouncedUiCallback,
  useDelayedDebouncedCallback,
  useQueuedDebouncedCallback,
}

