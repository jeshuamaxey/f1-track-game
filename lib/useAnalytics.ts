"use client"

import { usePostHog } from "posthog-js/react"
import EVENTS, { EventName } from "./events"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { User } from "@supabase/supabase-js"

const UUIDv4Pattern = /[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/gi

type AnyDict = { [key: string]: any }

const useAnalytics = () => {
  const pathname = usePathname()
  const posthog = usePostHog()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const getNormalisedPath = () => pathname.replace(UUIDv4Pattern, ":id")

  const capture = (eventName: EventName, meta?: AnyDict) => {
    posthog.capture(eventName, {
      ...meta,
      // fields not overridable by meta
      normalised_path: getNormalisedPath(),
      is_error: false,
    })
  }

  const captureError = (error: Error, meta?: AnyDict) => {
    const eventName = error.message.toLocaleLowerCase().replaceAll(" ", "_") || EVENTS.unknown_error

    posthog.capture(eventName, {
      ...meta,
      // fields not overridable by meta
      normalised_path: getNormalisedPath(),
      is_error: true,
    })
  }

  const identify = (user: User) => {
    setCurrentUser(user)
    posthog.identify(user.id, {
      email: user.email,
    })
  }

  const cleanup = () => {
    setCurrentUser(null)
    posthog.reset()
  }

  const analytics = {
    capture,
    identify,
    cleanup,
    captureError,
  }

  return analytics
}

export default useAnalytics
