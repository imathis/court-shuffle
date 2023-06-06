import React from 'react'
import QRCode from 'qrcode-svg-table'

const QrCode = ({ url, ...props }) => {
  const svg = React.useMemo(() => {
    const code = new QRCode({
      content: url,
      container: 'svg-viewbox', // Responsive use
      join: true, // Crisp rendering and 4-5x reduced file size
    })

    return code.svg()
  }, [url])

  return (
    <div
      className="qr-code"
      /* eslint-disable react/no-danger */
      dangerouslySetInnerHTML={{ __html: svg }}
      {...props}
    />
  )
}

export {
  QrCode,
}

