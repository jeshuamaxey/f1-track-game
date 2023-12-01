"use client"

import useAnalytics from "@/lib/useAnalytics"
import { useEffect } from "react"

const ResetAnalytics = () => {
  const analytics = useAnalytics()
  useEffect(() => analytics.cleanup())
  return <></>
}

export default ResetAnalytics