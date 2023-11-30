import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Button } from './ui/button'
import posthog from "posthog-js"

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const signOut = async () => {
    'use server'

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    await supabase.auth.signOut()
    posthog.reset()
    return redirect('/login')
  }

  return user ? (
    <form action={signOut}>
    <Button variant="outline">
      Logout
    </Button>
  </form>

  ) : (
    <Button variant="outline" asChild>
      <Link href="/login">
        Login
      </Link>
    </Button>
  )
}
