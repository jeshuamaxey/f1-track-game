import { Guess } from "@/app/types"
import { Button } from "./ui/button"
import { calculateTotalElapsed, renderElapsed } from "@/lib/utils"

type ShareButtonProps = {
  guesses: Guess[]
}

const createShareText = (guesses: Guess[]): string => {
  const guessEmojis = guesses.map(g => g.option.correct ? "🟢" : "🔴").join("")
  const elapsed = calculateTotalElapsed(guesses)

  return [
    "F1 track guesser 001",
    "",
    guessEmojis,
    renderElapsed(elapsed)
  ].join("\n")
}

const ShareButton = ({ guesses }: ShareButtonProps) => {
  const share = () => {
    const text = createShareText(guesses)
    if(navigator.share) {
      navigator.share({
        text
      })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        alert(`${text}\n\n(copied to clipboard)`)
      })
    }
  }
  return <Button onClick={() => share()} variant="secondary">Share</Button>
}

export default ShareButton