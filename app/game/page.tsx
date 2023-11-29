import { createClient } from '@/utils/supabase/server'
import dynamic from "next/dynamic";
import { cookies } from "next/headers";

// disable SSR for game player as game state can be stored in local storage
const GamePlayer = dynamic(() => import('./game-player'), { ssr: false })

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: {session} } = await supabase.auth.getSession()

  if(!session) {
    return <GamePlayer dailyResults={[]} />
  }

  const { data: { user }, error: userError} = await supabase.auth.getUser()
  const { data: dailyResults, error } = await supabase.from("daily_results").select("*")

  if(userError || error) {
    return <p className="text-center">Something went wrong :(</p>
  }

  return <GamePlayer dailyResults={dailyResults} user={user} />
}