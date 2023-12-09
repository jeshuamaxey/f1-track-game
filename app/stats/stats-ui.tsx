"use client"

import { getChallengeNumber, getDateKey, getScoreEmojis, renderElapsed, roundTo } from "@/lib/utils"
import { Database } from "../types/supabase"
import { motion } from "framer-motion";
import Link from "next/link";

type StatsProps = {
  dailyResults: Database["public"]["Tables"]["daily_results"]["Row"][]
}

const nDays = 7

const StatsUI = ({dailyResults}: StatsProps) => {
  const today = new Date()

  const lastNDays = Array.from({length: nDays}, (_, i) => {
    const d = new Date(today.getTime() - i*1000*60*60*24)
    const dateKey = getDateKey(d)
    const result = dailyResults.find(r => r.date_key === dateKey)
    return {
      dateKey,
      result,
    }
  })

  const nResults = lastNDays.filter(res => !!res.result).length
  const averages = lastNDays.reduce((av, day) => {
    if(!day.result) return av

    const nGuesses = day.result.guesses.length
    const nCorrect = day.result.guesses.filter(g => g.option.correct).length
    const totalElapsed = day.result.guesses.reduce((total, guess) => guess.elapsed + total, 0)
    const totalPc = day.result.guesses.reduce((total, guess) => guess.percentComplete + total, 0)

    return {
      elapsed: roundTo(av.elapsed + (totalElapsed/nGuesses), 0),
      pc: roundTo(av.pc + (totalPc/(nResults * nGuesses)), 2),
      correct: av.correct + (nCorrect/(nResults * nGuesses))
    }
  }, {
    elapsed: 0,
    pc: 0,
    correct: 0
  })
  
  return (
    <div className="flex flex-col">
      <motion.div className="pb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0 }}>
        <p className="text-sm text-foreground/80 pb-2">Correct guesses</p>
        <p className="font-f1-wide text-2xl">{roundTo(100*averages.correct, 0)}%</p>
      </motion.div>

      <motion.div className="pb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}>
        <p className="text-sm text-foreground/80 pb-2">Average time to complete</p>
        <p className="font-f1-wide text-2xl">{renderElapsed(averages.elapsed)}</p>
      </motion.div>
        
      <motion.div className="pb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}>
        <p className="text-sm text-foreground/80 pb-2">Average track revealed</p>
        <p className="font-f1-wide text-2xl">{roundTo(100*averages.pc, 2)}%</p>
      </motion.div>

      <motion.div className="pb-6"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3}}>
        <table className="table-auto w-full">
          <thead>
              <tr className="">
                <th className="py-1 font-f1-bold text-left text-sm text-foreground/80">Last 7 days</th>
                <th className="py-1 font-f1-bold text-right text-sm text-foreground/80">Result</th>
              </tr>
          </thead>
          <tbody>
          {
            lastNDays.map(res => {
              const { result, dateKey } = res
              const isToday = dateKey === getDateKey()
              const emojis = result ? getScoreEmojis(result.guesses.length, result.guesses): isToday
                                    ? <Link href="/game">Play now</Link> : "DNS"
              return (
                <tr key={dateKey} className="odd:bg-slate-900">
                  <td className="py-1 text-sm">{getChallengeNumber(dateKey)}</td>
                  <td className="py-1 text-right">{emojis}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

export default StatsUI