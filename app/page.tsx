import dynamic from "next/dynamic";

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import AuthButton from '../components/AuthButton'

// disable SSR for game player as game state can be stored in local storage
const HomeScreen = dynamic(() => import('@/components/home-screen'), { ssr: false })

export default async function Index() {
  const cookieStore = cookies()

  const canInitSupabaseClient = () => {
    // This function is just for the interactive tutorial.
    // Feel free to remove it once you have Supabase connected.
    try {
      createClient(cookieStore)
      return true
    } catch (e) {
      return false
    }
  }

  const isSupabaseConnected = canInitSupabaseClient()  

  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <nav className="w-full flex justify-between border-b border-b-foreground/10 h-16">
        <div className="flex items-center p-3">
          <h1>F1 tracks</h1>
        </div>
        <div className="max-w-4xl flex justify-between items-center p-3 text-sm">
          {isSupabaseConnected && <AuthButton />}
        </div>
      </nav>
      <HomeScreen />
    </div>
  )
}
