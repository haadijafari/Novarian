import "@/style/globals.css"
import { tanha, vazirmatn, sahel, estedad } from '../lib/font'
import { Providers } from "./providers"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="fa" dir="rtl" className={`${tanha.variable} ${vazirmatn.variable} ${sahel.variable} ${estedad.variable} bg-surface`} >
      <body>
        <Providers>
          <div>
            {children}
          </div>
        </Providers>
      </body>
    </html >
  )
}
