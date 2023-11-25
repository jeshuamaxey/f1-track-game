import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import useGameState, { GameState } from "@/lib/useGameState"
import { User } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"
import { Database } from "../types/supabase"

type ClashResolverProps = {
  localDays: string[]
  clashes: string[]
  allLocalResults: {[key: string]: GameState}
  user: User
}

const ClashResolver = ({
  localDays,
  clashes,
  allLocalResults,
  user
}: ClashResolverProps) => {
  const nLocalResults = localDays.length
  const nClashes = clashes.length
  const nNewResults = nLocalResults - nClashes

  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const router = useRouter()
  const [,,clearGameStates] = useGameState({})

  const handleClearLocalData = () => {
    clearGameStates()
    router.push("/stats")
  }
  
  const handleWriteLocalData = async () => {
    const newResults = [] 
    
    for(const date_key in allLocalResults) {
      newResults.push({
        date_key,
        user_id: user!.id,
        guesses: allLocalResults[date_key].guesses
      })
    }
    
    supabase.from("daily_results").upsert(newResults).then(({data, error}) => {
      if(!error) {
        clearGameStates()
        router.push("/stats")
      }
    })
  }

  return <div className="h-full flex flex-col align-middle p-4 gap-8">
    <h1 className="text-3xl mx-auto">Preserve your game data</h1>

    <p className="">You have logged in on a device with results that conflict with the results stored in your F1 tracks profile.</p>
    <p>What would you like to do?</p>
    
    <div className="border border-slate-50 bg-slate-900 p-4 rounded-md flex flex-col gap-4">
      <h3 className="font-f1-bold">Clear device data</h3>
      <p className="text-xs">None of the data on this device will be saved to your F1 tracks profile. This will delete {nLocalResults} result(s) from the device and you will have to play today's game again.</p>
      <Button variant="outline" onClick={() => handleClearLocalData()}>Clear device data</Button>
    </div>

    <div className="border border-slate-50 bg-slate-900 p-4 rounded-md flex flex-col gap-4">
      <h3 className="font-f1-bold">Update my profile with this device's data</h3>
      <p className="text-xs">
        Save {nLocalResults} result(s) from this device to your F1 tracks profile.
        {nNewResults > 0 && ` This will add ${nNewResults} result(s) to your profile. `}
        {nClashes > 0 && `This will overwrite ${nClashes} result(s).`}
      </p>
      <Button variant="outline" onClick={() => handleWriteLocalData()}>Save device data</Button>
    </div>
  </div>
}

export default ClashResolver