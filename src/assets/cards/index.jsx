import { useState, useEffect } from 'react'

// Get all card SVG files and derive card names
const cardFiles = import.meta.glob('./*.svg')
const availableCards = Object.keys(cardFiles).map(path => {
  // Extract filename without extension from path
  return path.split('/').pop()?.replace('.svg', '') ?? ''
}).filter(Boolean)

const CardSvg = ({ name, ...rest }) => {
  const [IconComponent, setIconComponent] = useState(null)

  useEffect(() => {
    const loadCard = async () => {
      try {
        const cardModule = await cardFiles[`./${name}.svg`]()
        setIconComponent(() => cardModule.default)
      } catch (err) {
        console.error(err, `Failed to load card: ${name}`)
      } finally {
        //setLoading(false)
      }
    }

    loadCard()
  }, [name])

  return IconComponent ? <IconComponent {...rest} /> : null
}

// Optional: Pre-cache all card SVGs for better performance
const preloadAllCards = async () => {
  const loadPromises = Object.values(cardFiles).map(importFn => {
    return importFn().catch(err => {
      console.error('Failed to preload card', err)
    })
  })

  await Promise.all(loadPromises)
}

export {
  CardSvg,
  preloadAllCards,
  availableCards,
}
