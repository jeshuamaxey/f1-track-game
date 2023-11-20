import { Guess } from "@/app/types"
import { Button } from "./ui/button"

type ShareButtonProps = {
  guesses: Guess[]
}

// `
//   F1 track guesser 001

//   #1: ⬜️ ⬜️ ⬜️ (got it in <33%)
//   #2: 🟥 ⬜️ ⬜️ (got it in <66%)
//   #2: 🟥 🟥 ⬜️ (got it in <100%)
//   #3: 🟥 🟥 🟥 (got it in >100%)
//   #3: ⬛️ ⬛️ ⬛️ (incorrect)
// `

const createShareText = (guesses: Guess[]): string => {
  const shareTextLines = ["F1 track guesser 001", ""]
  guesses.forEach((guess, i) => {
    if(guess.option.correct) {
      if(guess.percentComplete < 0.33) shareTextLines.push(`#${i+1}: ⬜️ ⬜️ ⬜️`)
      else if(guess.percentComplete < 0.66) shareTextLines.push(`#${i+1}: 🟥 ⬜️ ⬜️`)
      else if(guess.percentComplete < 1) shareTextLines.push(`#${i+1}: 🟥 🟥 ⬜️`)
      else shareTextLines.push(`#${i+1}: ⬛️ ⬛️ ⬛️`)
    } else {
      shareTextLines.push(`#${i+1}: ⬛️ ⬛️ ⬛️`)
    }
  })

  return shareTextLines.join("\n")
}

const ShareButton = ({ guesses }: ShareButtonProps) => {
  const share = () => {

    if(navigator.share) {
      navigator.share({
        text: createShareText(guesses)
      })

    } else {
      alert("todo: copy to clipboard")
    }
  }
  return <Button onClick={() => share()} variant="secondary">Share</Button>
}

export default ShareButton