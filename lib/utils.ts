import { Challenge, Guess } from "@/app/types/app"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import gen from "random-seed"
import circuits from "../app/circuits.json"
import config from "../app/config.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const padNum = (num: number, zeros: number) => {
  return String(num).padStart(zeros, "0")
}

export const getDateKey = (date?: Date) : string => {
  const d = date ? date : new Date()
  return d.toISOString().split("T")[0]
}

export const getChallengeNumber = (dateKey?: string) => {
  const d = dateKey || getDateKey()
  const nDays = Math.round((new Date(d).getTime() - new Date(config.DATE_OF_GAME_ONE).getTime()) / (1000 * 60 * 60 * 24));
  return padNum(nDays, 3)
}

/*
 * @ t: number duration in millisecond
 **/
export const renderElapsed = (t: number) => {
  const ms = t % 1000
  const secs = (t-ms)/1000 % 60
  const mins = (t-ms-(1000*secs))/60000

  return `${padNum(mins, 2)}:${padNum(secs, 2)}.${padNum(roundTo(ms, 0), 3)}`
}

export function roundTo(n: number, digits: number): number {
  if (digits === undefined) {
    digits = 0
  }

  var multiplicator = Math.pow(10, digits)
  n = parseFloat((n * multiplicator).toFixed(11))
  return Math.round(n) / multiplicator
}

export function generateChallenges(n: number): Challenge[] {
  const challenges: Challenge[] = []
  const rand = gen.create(new Date().toDateString())

  while(challenges.length < n) {
    const circuit = circuits[rand.range(circuits.length)]
    const alreadyPicked = challenges.map(c => c.circuit.value).indexOf(circuit.value) > -1
    if(alreadyPicked) {
      continue;
    }

    const options: Challenge["options"] = [{
      name: circuit.name,
      value: circuit.value,
      emoji: circuit.emoji,
      flag: circuit.flag,
      correct: true
    }]
    
    while(options.length < 4) {
      const opt = circuits[rand.range(circuits.length)]
      const optAlreadyPicked = options.map(o => o.value).indexOf(opt.value) > -1
      if(optAlreadyPicked) continue;

      options[Math.random() > 0.5 ? "push" : "unshift"]({
        name: opt.name,
        value: opt.value,
        emoji: opt.emoji,
        flag: opt.flag,
        correct: false
      })
    }

    challenges.push({
      circuit,
      options
    })
  }

  return challenges
}

export function calculateTotalElapsed(guesses: Guess[]): number {
  return guesses.reduce((total, guess) => total+(guess.option.correct ? guess.elapsed : config.DURATION*1000), 0)
}

export function getScoreEmojis(nChallenges: number, guesses: Guess[]) {
  let i = 0
  const score = []

  while(i<nChallenges) {
    if(guesses[i]) {
      score.push(guesses[i].option.correct ? "🟢" : "🔴")
    } else {
      score.push("⬜️")
    }
    i++;
  }
  
  return score.join(" ")
}