import useLocalStorage from "use-local-storage";

import { Guess } from "@/app/types/app"

const todaysDateKey = () : string => {
  const d = new Date()
  return d.toISOString().split("T")[0]
}

export type GameState = {
  guesses: Guess[],
  circuitIndex: number
}

const INITIAL_GAME_STATE = {
  guesses: [],
  circuitIndex: 0,
}

const useGameState = (date?: string): [
  GameState,
  (newState: Partial<GameState>) => void
] => {

  // use today if no date is specified
  const dateKey = date || todaysDateKey()

  const [allGameStates, setGameState] = useLocalStorage<{[key: string]: GameState}>("allGameStates", {}); 

  const saveGame = (newState: Partial<GameState>) => {
    const currentState = allGameStates[dateKey]

    setGameState({
      [dateKey]: {
        ...INITIAL_GAME_STATE,
        ...currentState,
        ...newState
      }
    })
  }

  // initialise game state if none exists already
  if(!allGameStates[dateKey]) {
    saveGame(INITIAL_GAME_STATE)
    return [INITIAL_GAME_STATE, saveGame]
  } else {
    return [allGameStates[dateKey], saveGame]
  }
}

export default useGameState