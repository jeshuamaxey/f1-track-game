import { cookies } from "next/headers"
import AuthButton from "./AuthButton"

import { createClient } from '@/utils/supabase/server'
import Link from "next/link"

const Navbar = () => {
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
    <nav className="w-full flex justify-start border-b border-b-foreground/10 h-16">
      <div className="w-1/2 flex items-center p-3">
        <Link href="/">
          <h1>
          <span className="text-red-500">F1 </span>
          <span className="text-lxs">TRACKS</span>
          </h1>
        </Link>
      </div>
      <div className="w-1/2 flex justify-end items-center p-3 text-sm">
        {isSupabaseConnected && <AuthButton />}
      </div>
    </nav>
  )
}

export default Navbar