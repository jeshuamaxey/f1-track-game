// app/providers.tsx
"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

if (typeof window !== "undefined") {
  const api_host =`${window.origin}/ingest`

  process.env.NEXT_PUBLIC_POSTHOG_KEY
    ? posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host,
      })
    : console.error("NEXT_PUBLIC_POSTHOG_KEY not set. Unable to initialise posthog")
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      posthog.capture("$pageview", {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return <></>
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
