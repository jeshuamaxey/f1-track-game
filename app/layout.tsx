import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'F1 tracks game',
  description: 'Identify 3 F1 tracks. Fastest time wins. New challenges daily',
  openGraph: {
    title: 'F1 tracks game',
    description: 'Identify 3 F1 tracks. Fastest time wins. New challenges daily',
    type: 'website',
    images: ["./img/og-img.png"]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-950 text-slate-50 font-f1">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
        <main className="min-h-screen flex flex-col items-center">
          {children}
          <Analytics />
        </main>
          </ThemeProvider>
      </body>
    </html>
  )
}
