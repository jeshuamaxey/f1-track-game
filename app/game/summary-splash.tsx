import { cn, renderElapsed, roundTo } from "@/lib/utils"
import { motion } from "framer-motion"
import { Challenge, Guess } from "../types"
import { Button } from "@/components/ui/button"
import ShareButton from "@/components/share-button"

const STAGGER = 0.5 // time in secs between each animated ui element

type SummarySplashProps = {
  challenges: Challenge[]
  guesses: Guess[]
}

const SummarySplash = ({ challenges, guesses }: SummarySplashProps) => {
  const nCorrect = guesses.filter(g => g.option.correct).length
  const nTotal = guesses.length
  const totalElapsed = guesses.reduce((total, guess) => total+(guess.elapsed), 0)

  return (
    <div className="w-full h-full flex flex-col justify-center bg-foreground text-background">
      <h1 className="mx-auto text-center text-3xl pb-4">🏁 Game over!</h1>

      <div className="p-4">
        <p className="text-center">{nCorrect}/{nTotal} circuits in {renderElapsed(totalElapsed)}</p>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {challenges.map((challenge, index) => {
          const name = challenge.options.find(option => option.correct)!.name
          const guess = guesses[index]

          const revealDuration = 2

          return <motion.div key={challenge.circuit.viewBox}
            initial={{ opacity: 0, top: 20 }}
            animate={{ opacity: 1, top: 0 }}
            transition={{ duration: 0.5, delay: index*0.5 }}
            className={cn(
              "relative flex flex-row gap-4 p-4 border rounded", guess.option.correct
              ? "bg-slate-900 border-green-800"
              : "bg-slate-900 border-red-800")}>
            <div className="w-1/2 h-32">
              <svg className="max-h-full" viewBox={challenge.circuit.viewBox}>
                <motion.path id="result-bg-track"
                  fill="none"
                  stroke="white"
                  strokeWidth={4}
                  d={challenge.circuit.d}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{duration: revealDuration, delay: index*STAGGER}}
                />
                <motion.path
                  id="result-revealed-track"
                  fill="none"
                  // red-600
                  stroke="#dc2626"
                  strokeWidth={4}
                  d={challenge.circuit.d}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: guess.percentComplete }}
                  transition={{duration: guess.percentComplete*revealDuration, delay: index*STAGGER}}
                />
              </svg>
            </div>
            <div className="w-1/2 ">
              <h3 className="font-bold text-slate-200">{name}</h3>
              <h3 className="text-slate-400">{renderElapsed(guess.elapsed)}</h3>
              <h3 className="text-slate-400">{guess.percentComplete*100}%</h3>
            </div>
          </motion.div>
          })}
      </div>

      <div className="flex flex-col gap-4 p-4">
        <ShareButton />
      </div>
    </div>
  )
}

export default SummarySplash