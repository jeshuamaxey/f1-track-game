import { Database } from "./supabase"

export type Circuit = {
  name: string
  emoji: string
  flag: string
  value: string
  viewBox: string
  d: string
}

export type Challenge = {
  circuit: Circuit,
  options: {
    name: string,
    emoji: string
    flag: string
    value: string,
    correct: boolean
  }[]
}

export type Guess = {
  option: Challenge["options"][0],
  elapsed: number
  percentComplete: number
}

export type sbDailyResult = Database["public"]["Tables"]["daily_results"]["Row"]