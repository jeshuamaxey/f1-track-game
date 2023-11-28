import dynamic from "next/dynamic";

import Navbar from "@/components/navbar";
import { cookies } from "next/headers";
import { createClient } from '@/utils/supabase/server'

// disable SSR for game player as game state can be stored in local storage
const HomeScreen = dynamic(() => import('@/components/home-screen'), { ssr: false })

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("daily_results").select("*")

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <Navbar />
      <HomeScreen dailyResults={data} />
    </div>
  )
}
