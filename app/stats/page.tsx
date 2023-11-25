import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "../types/supabase"
import Navbar from "@/components/navbar"
import StatsUI from "./stats-ui"

export default async function Stats({}) {
  const cookieStore = cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name:string) {
          return cookieStore.get(name)?.value
        }
      }
    }
  )

  const {data: {user}, error: userError} = await supabase.auth.getUser()
  const {data: dailyResults, error} = await supabase.from("daily_results").select("*")

  if(error) return <p>Failed to fetch data</p>
  
  return <div className="w-full">
    <Navbar />
    <div className="container p-4">
      <h1 className="text-3xl pb-4">Stats</h1>

      {userError ? <div>
        Login or signup to access your stats
      </div> : <StatsUI dailyResults={dailyResults} />}
    </div>
  </div>
}