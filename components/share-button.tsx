import { Guess } from "@/app/types"
import { Button } from "./ui/button"
import { Share1Icon } from "@radix-ui/react-icons"
import { calculateTotalElapsed, padNum, renderElapsed } from "@/lib/utils"
import config from "../app/config.json"

type ShareButtonProps = {
  guesses: Guess[]
}

const createShareText = (guesses: Guess[]): string => {
  const guessEmojis = guesses.map(g => g.option.correct ? "🟢" : "🔴").join("")
  const elapsed = calculateTotalElapsed(guesses)


  const nDays = Math.round((new Date().getTime() - new Date(config.DATE_OF_GAME_ONE).getTime()) / (1000 * 60 * 60 * 24));

  return [
    `F1 track guesser ${padNum(nDays, 3)}`,
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
  return <Button onClick={() => share()} variant="secondary">
    <Share1Icon className="mr-2 h-4 w-4" />Share</Button>
}

export default ShareButton