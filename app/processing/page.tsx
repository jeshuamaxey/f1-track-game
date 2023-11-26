import dynamic from "next/dynamic";
import { cookies } from "next/headers"
import { createClient } from '@/utils/supabase/server'

import { redirect } from "next/navigation"

// disable SSR for game player as game state can be stored in local storage
const ProcessDataPostAuth = dynamic(() => import('./processDataPostAuth'), { ssr: false })

export default async function Processing() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }, error: userError} = await supabase.auth.getUser()
  const { data: backendResults, error } = await supabase.from("daily_results").select("*")

  if(!user || !backendResults) {
    redirect("/login?message=error_occured")
  }

  return <ProcessDataPostAuth user={user} backendResults={backendResults} />
}