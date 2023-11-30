import Link from 'next/link'
import { headers, cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function SignUp({
  searchParams,
}: {
  searchParams: { errorMessage: string, postSignUpMessage: string, emailDomain: string }
}) {
  const signUp = async (formData: FormData) => {
    'use server'

    const origin = headers().get('origin')
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?postSignUp=1`,
      },
    })

    if (error) {
      if(error.message === "User already registered") {
        return redirect('/signup?errorMessage=Email already in use. Try signing in')
      } else {
        return redirect('/signup?errorMessage=Could not create a user profile')
      }
    }

    const domain = email.split('@')[1]
    return redirect(`/signup?postSignUpMessage=We have sent you an email to verify your profile. Please check your email (including your spam) to continue.&emailDomain=${domain}`)
  }

  const showForm = !searchParams.postSignUpMessage

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

      {showForm && <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2"
        action={signUp}
      >
        <p className="pb-8 text-center">Track your progress by creating an account</p>
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
          Sign Up
        </Button>
        <p className="text-center">Got an account? <Link className="underline" href="/login">Login here</Link></p>
        {searchParams?.errorMessage && (
          <p className="mt-4 p-4 bg-foreground/10 text-center border-l-4 border-red-500">
            {searchParams.errorMessage}
          </p>
        )}
      </form>
      }

      {/* POST SIGNUP UI */}
      {searchParams?.postSignUpMessage && (
        <p className="my-4 p-4 bg-foreground/10 text-center border-l-4 border-slate-600">
          {searchParams.postSignUpMessage}
        </p>
      )}
    </div>
  )
}
