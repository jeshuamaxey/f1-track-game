import { PHProvider, PostHogPageview } from '@/components/posthog-provider';
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';

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

const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <body className="bg-slate-950 text-slate-50 font-f1">
        <PHProvider>
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
        </PHProvider>
      </body>
    </html>
  )
}
