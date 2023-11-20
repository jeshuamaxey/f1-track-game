import { calculateTotalElapsed, cn, getScoreEmojis, renderElapsed, roundTo } from "@/lib/utils"
import { motion } from "framer-motion"
import { Challenge, Guess } from "../types"
import ShareButton from "@/components/share-button"
import config from "../config.json"

const STAGGER = 0.5 // time in secs between each animated ui element

type SummarySplashProps = {
  challenges: Challenge[]
  guesses: Guess[]
}

const SummarySplash = ({ challenges, guesses }: SummarySplashProps) => {
  const totalElapsed = calculateTotalElapsed(guesses)
  const scoreEmojis = getScoreEmojis(challenges, guesses)

  return (
    <div className="w-full h-full flex flex-col justify-center bg-foreground text-background">
      <div className="w-full md:w-1/2 lg:container mx-auto">
        <h1 className="mx-auto text-center pt-4">🏁 Timing sheet</h1>

        <div className="p-2">
          <p className="text-center text-sm">{scoreEmojis} in {renderElapsed(totalElapsed)}</p>
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
                <svg className="max-h-full mx-auto" viewBox={challenge.circuit.viewBox}>
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
                <h3 className="font-bold text-slate-200 pb-2">{name}</h3>
                {guess.option.correct ? (
                  <h3 className="text-slate-400 text-sm">Correctly guessed in: {renderElapsed(guess.elapsed)}</h3>
                  ) : (
                  <h3 className="text-slate-400 text-sm">Incorrect guess. {config.DURATION}s time penalty</h3>
                )}
              </div>
            </motion.div>
            })}
        </div>

        <motion.div className="flex flex-col gap-4 p-4 pt-0 relative"
          initial={{ opacity: 0, top: 20 }}
          animate={{ opacity: 1, top: 0 }}
          transition={{ duration: 0.5, delay: guesses.length*0.5 }}>
          <ShareButton guesses={guesses} />
        </motion.div>
      </div>
    </div>
  )
}

export default SummarySplash