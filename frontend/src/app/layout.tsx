import "@/style/globals.css"
import { ViewTransitions } from 'next-view-transitions'
import { tanha, vazirmatn, sahel, estedad } from '../lib/font'
import { Providers } from "./providers"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html suppressHydrationWarning lang="fa" dir="rtl" className={`${tanha.variable} ${vazirmatn.variable} ${sahel.variable} ${estedad.variable} bg-surface`} >
        <body>
          <Providers>
            <div>
              {children}
            </div>
          </Providers>
        </body>
      </html>
    </ViewTransitions>
  )
}
