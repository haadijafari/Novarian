import "@/style/globals.css"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-black">
        <div>
          {children}
        </div>
      </body>
    </html >
  )
}
