import Image from 'next/image'

export default function ProductCard({
  width = 400,
  height = 295,
  radius = 20,
  curveSize = 15,
  offsetX = 90,
  offsetY = 20,
  backgroundColor = '#3FB8AF',
}: {
  width?: number
  height?: number
  radius?: number
  curveSize?: number
  offsetX?: number
  offsetY?: number
  backgroundColor?: string
}) {
  const cssVars = {
    '--r': `${radius}px`,
    '--s': `${curveSize}px`,
    '--x': `${offsetX}px`,
    '--y': `${offsetY}px`,
    '--bg': backgroundColor,
  } as React.CSSProperties

  return (
    <li
      className="inverted-radius"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...cssVars,
      }}
    >
      <Image
        className="rounded-2xl"   /* if you want an inner rounding on the image itself */
        src="/1.jpg"
        width={width}
        height={height}
        alt="product"
      />
    </li>
  )
}

