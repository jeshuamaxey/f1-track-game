import { getChallengeNumber, getDateKey, getScoreEmojis, renderElapsed, roundTo } from "@/lib/utils"
import { Database } from "../types/supabase"

type StatsProps = {
  dailyResults: Database["public"]["Tables"]["daily_results"]["Row"][]
}

const nDays = 7

const StatsUI = ({dailyResults}: StatsProps) => {
  const today = new Date()
  Array.from({length: 5}, (v, i) => i)
  const lastNDays = Array.from({length: nDays}, (_, i) => {
    const d = new Date(today.getTime() - i*1000*60*60*24)
    const dateKey = getDateKey(d)
    const result = dailyResults.find(r => r.date_key === dateKey)
    return {
      dateKey,
      result,
    }
  })

  const averages = lastNDays.reduce((av, day) => {
    if(!day.result) return av

    const nGuesses = day.result.guesses.length
    const nCorrect = day.result.guesses.filter(g => g.option.correct).length
    const totalElapsed = day.result.guesses.reduce((total, guess) => guess.elapsed + total, 0)
    const totalPc = day.result.guesses.reduce((total, guess) => guess.percentComplete + total, 0)

    return {
      elapsed: roundTo(av.elapsed + (totalElapsed/nGuesses), 0),
      pc: roundTo(av.pc + (totalPc/nGuesses), 2),
      correct: av.correct + (nCorrect/(nDays * nGuesses))
    }
  }, {
    elapsed: 0,
    pc: 0,
    correct: 0
  })

  console.log({lastSevenDays: lastNDays, averages})
  
  return (
    <div className="flex flex-col">
      <div className="pb-6">
        <p className="text-sm text-foreground/80 pb-2">Correct guesses</p>
        <p className="font-f1-wide text-2xl">{roundTo(100*averages.correct, 0)}%</p>
      </div>

      <div className="pb-6">
        <p className="text-sm text-foreground/80 pb-2">Average time to complete</p>
        <p className="font-f1-wide text-2xl">{renderElapsed(averages.elapsed)}</p>
      </div>
        
      <div className="pb-6">
        <p className="text-sm text-foreground/80 pb-2">Average track revealed</p>
        <p className="font-f1-wide text-2xl">{roundTo(100*averages.pc, 2)}%</p>
      </div>

      <div className="pb-6">
        <h2 className="text-sm text-foreground/80 pb-2">Last 7 days</h2>
        <table className="table-auto w-full">
          <thead>
              <tr className="border-b">
                <th className="text-left text-xs">Game</th>
                <th className="text-right text-xs">Result</th>
              </tr>
          </thead>
          <tbody>
          {
            lastNDays.map(res => {
              const { result, dateKey } = res
              const emojis = result ? getScoreEmojis(result.guesses.length, result.guesses) : "⬜️ ⬜️ ⬜️"
              return (
                <tr key={dateKey} className="border-b">
                  <td className="text-xs text-foreground/80">{getChallengeNumber(dateKey)}</td>
                  <td className="text-right">{emojis}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StatsUI