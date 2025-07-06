import "@/style/globals.css"
import { Providers } from "./providers"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="fa" dir="rtl">
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
