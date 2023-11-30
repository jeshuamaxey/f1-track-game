import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import posthog from "posthog-js"

export default function Login({
  searchParams,
}: {
  searchParams: { errorMessage: string, emailDomain: string }
}) {
  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: {user}, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?errorMessage=Could not authenticate user')
    }

    user && posthog.identify( user.id, { email: user.id} );

    return redirect('/processing')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{' '}
        Back
      </Link>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2"
        action={signIn}
      >
        <h1 className="text-3xl pb-4 text-center">Login</h1>
        <p className="pb-8 text-center">Login to access your profile and stats</p>
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <Button className="mb-2">
          Log In
        </Button>

        <p className="text-center">Or <Link className="underline" href="/signup">create an account here</Link>.</p>

        {searchParams?.errorMessage && (
          <p className="mt-4 p-4 bg-foreground/10 text-center border-l-4 border-red-500">
            {searchParams.errorMessage}
          </p>
        )}
      </form>

    </div>
  )
}
