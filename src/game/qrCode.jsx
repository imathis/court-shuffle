import React from 'react'
import { useParams } from 'react-router-dom'

import QRCode from 'qrcode-svg-table'

const QrCode = () => {
  const { deckId } = useParams()

  const svg = React.useMemo(() => {
    const code = new QRCode({
      content: `https://tenniscards.app/deck/${deckId}/start`,
      container: 'svg-viewbox', // Responsive use
      join: true, // Crisp rendering and 4-5x reduced file size
    })

    return code.svg()
  }, [deckId])

  return (
    <div
      className="qr-code"
      /* eslint-disable react/no-danger */
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export {
  QrCode,
}

