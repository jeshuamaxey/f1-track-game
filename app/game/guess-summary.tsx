import { Button } from "@/components/ui/button"

type GuessSummaryProps = {
  next: () => void,
  gameOver: boolean,
  correct: boolean
}

const GuessSummary = ({next, gameOver, correct}: GuessSummaryProps) => {
  return (
    <div className="w-full h-full flex flex-col justify-center">
      {correct ?
        <h1 className="mx-auto text-center text-background text-3xl">🏁 Correct!</h1> :
        <h1 className="mx-auto text-center text-background text-3xl">🚩 Incorrect</h1>
      }
      {!gameOver &&
        <Button
          className="mx-auto mt-4"
          variant="outline"
          onClick={() => next()}
          >
          Next circuit
        </Button>
      }
    </div>
  )
}

export default GuessSummary