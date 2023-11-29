import { useLocalStorage } from 'react-use';
import { createBrowserClient } from "@supabase/ssr"

import config from "../app/config.json"
import { Guess, sbDailyResult } from "@/app/types/app"
import { Database } from "@/app/types/supabase";
import { User } from "@supabase/supabase-js";
import { getDateKey } from './utils';

const GAME_STATE_KEY = "allGameStates"

const _getAllLocalGameStates = (): { [key: string]: GameState } =>  JSON.parse(localStorage.getItem(GAME_STATE_KEY) || "{}")

const _setGameStates = (newState: {}) => {
  localStorage.setItem(GAME_STATE_KEY, JSON.stringify(newState))
}

const _clearGameStates = () => localStorage.removeItem(GAME_STATE_KEY);

const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type GameState = {
  guesses: Guess[],
  circuitIndex: number
}

type AllGameStates = {[key: string]: GameState}

const INITIAL_GAME_STATE = {
  guesses: [],
  circuitIndex: 0,
}

export const gameStateExists = (): boolean => {
  const [allGameStates] = useLocalStorage<AllGameStates>("allGameStates", {});

  let exists = false
  for(const dateKey in allGameStates) {
    exists = exists || allGameStates[dateKey].guesses.length > 0
  }
  return exists 
}

export const getAllGames = ({complete}: {complete?: boolean}) => {
  const allGames =  _getAllLocalGameStates()
  
  if(typeof complete === "undefined") return allGames
  
  const games: AllGameStates = {}
  for(const dateKey in allGames) {
    if(complete) {
      if(allGames[dateKey].guesses.length === config.N_CHALLENGES) {
        games[dateKey] = allGames[dateKey]
      }
    } else {
      if(allGames[dateKey].guesses.length < config.N_CHALLENGES) {
        games[dateKey] = allGames[dateKey]
      }
    }
  }
  return games
}

const useGameState = ({
  date,
  dailyResults,
  user
}: {date?: string, dailyResults?: sbDailyResult[], user?: User | null}): [
  GameState,
  (newState: Partial<GameState>) => void,
  () => void
] => {

  // use today if no date is specified
  const dateKey = date || getDateKey()

  const localGameStates = _getAllLocalGameStates()
  const sbGameStates = dailyResults ? dailyResults.reduce((states, res): AllGameStates => {
    return {
      ...states,
      [res.date_key]: {
        guesses: res.guesses,
        circuitIndex: res.guesses.length-1
      }
    }
  }, {} as AllGameStates) : {}

  const saveGame = async (newState: Partial<GameState>) => {
    console.log("saveGame()", {newState})
    const allLocalGameStates = _getAllLocalGameStates()
    const currentState = allLocalGameStates ? allLocalGameStates[dateKey] : {}

    const updatedState = {
      ...INITIAL_GAME_STATE,
      ...currentState,
      ...newState
    }

    _setGameStates({
      [dateKey]: updatedState
    })

    // save to backend if the game is complete and user is logged in
    if(user && updatedState.guesses.length === config.N_CHALLENGES) {
      console.log("saving current game to backend")
      await supabase.from("daily_results").upsert({
        user_id: user.id,
        date_key: dateKey,
        guesses: updatedState.guesses
      })
    }

  }

  // initialise game state if none exists already
  const allGameStates = {
    ...localGameStates,
    ...sbGameStates
  }

  if(!allGameStates || !allGameStates[dateKey]) {
    saveGame(INITIAL_GAME_STATE)
    return [INITIAL_GAME_STATE, saveGame, _clearGameStates]
  } else {
    return [allGameStates[dateKey], saveGame, _clearGameStates]
  }
}

export default useGameState