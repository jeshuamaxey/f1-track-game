"use client"

import useGameState, { getAllGames } from "@/lib/useGameState"
import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { Database } from "../types/supabase"
import { User } from "@supabase/supabase-js"
import ClashResolver from "./clashResolver"
import { useState } from "react"
import { sbDailyResult } from "../types/app"

type ProcessDataPostAuthProps = {
  user: User
  backendResults: sbDailyResult[]
}

const ProcessDataPostAuth = ({
  user,
  backendResults
}: ProcessDataPostAuthProps) => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [uiError, setUiError] = useState<string | null>(null)

  const [,,clearGameStates] = useGameState({})
  const allLocalResults = getAllGames({complete: true})
  
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const backendDays = backendResults.map(res => res.date_key)
  const localDays = Object.keys(allLocalResults)
  const clashes = backendDays.filter(d => localDays.includes(d))

  console.log([
    `${localDays.length > 0 ? "🟢" : "🔴"} local data`,
    `${backendResults.length > 0 ? "🟢" : "🔴"} backend data`,
    clashes.length > 0 ? "🔴 clashes exist" : "🟢 clashes do not exist"
  ].join("\n"))
  
  // no local data
  if(localDays.length === 0) {
    console.log("no local data to deal with")
    router.push("/stats")
  }
  
  // local data doesn't clash with backend
  // OR no existing data on backend

  else if(
    (backendResults.length > 0 && clashes.length === 0)
    || backendDays.length === 0 
  ) {
    if(backendResults.length > 0 && clashes.length === 0) {
      console.log("local data doesn't clash with backend")
    }
    if(backendDays.length === 0) {
      console.log("no existing data on backend")
    }

    const newResults = []

    for(const dateKey in allLocalResults) {
      newResults.push({
        user_id: user!.id,
        date_key: dateKey,
        guesses: allLocalResults[dateKey].guesses
      })
    }

    supabase.from("daily_results").upsert(newResults).then(({data, error}) => {
      if(!error) {
        clearGameStates()
        router.push("/stats")
      } else {
        setUiError("failed to update F1 tracks profile with the latest game data")
      }
    })

  } 

  // local data clashes with backend data
  else if (clashes.length > 0) {
    console.log("local data clashes with backend data")
    setLoading(true)
  }

  if(uiError) {
    return <div className="h-full flex flex-col align-middle p-4 gap-8">
      <div className="border border-red-500 bg-slate-900 p-4 rounded-md flex flex-col gap-4">
      <h3 className="font-f1-bold">Error occured</h3>
      <p className="">{uiError}</p>
      <p className="">Please logout and try again</p>
    </div>
    </div>
  }

  return loading ? (
    <div className="h-full flex flex-col align-middle p-4 gap-8">
      <h1 className="text-3xl mx-auto">Loading your profile...</h1>
    </div>
  ) : <ClashResolver
    localDays={localDays}
    clashes={clashes}
    user={user}
    allLocalResults={allLocalResults} />
}

export default ProcessDataPostAuth