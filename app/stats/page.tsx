import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { Database } from "../types/supabase"
import { getScoreEmojis } from "@/lib/utils"

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

  const {data: dailyResults, error} = await supabase.from("daily_results").select("*")

  if(error) return <p>Failed to fetch data</p>
  
  return <div>
    <h1 className="p-4 text-3xl">Stats</h1>
    <div>
      {dailyResults.map(res => {
        const { guesses } = res.results
        return (
        <p key={res.date_key}>
          {res.date_key} - {getScoreEmojis(guesses.length, guesses)}
        </p>)
      })}
    </div>
  </div>
}