import { Button } from "@/components/ui/button"
import { Challenge, Guess } from "../types"
import { renderElapsed } from "@/lib/utils"

type GuessSummaryProps = {
  next: () => void,
  gameOver: boolean,
  guess?: Guess
  correctOption: Challenge["options"][0]
}

const GuessSummary = ({next, gameOver, guess, correctOption}: GuessSummaryProps) => {
  if(!guess) return null

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {guess.option.correct ?
        <div className="flex flex-col gap-4">
          <h1 className="mx-auto text-center text-background text-3xl">🏁 Correct!</h1>
          <p className="mx-auto text-center text-background">Time: {renderElapsed(guess.elapsed)}</p>
        </div>
        :
        <div className="flex flex-col gap-4">
          <h1 className="mx-auto text-center text-background text-3xl">🚩 Incorrect</h1>
          <p className="mx-auto text-center text-background">The correct answer was {correctOption.flag} {correctOption.name}</p>
        </div>
      }
        <Button
          className="mx-auto mt-4" variant="outline"
          onClick={() => next()}
          >
          {gameOver ? "Timing sheet" : "Next circuit"}
        </Button>
    </div>
  )
}

export default GuessSummary