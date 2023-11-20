import { Challenge } from "@/app/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import gen from "random-seed"
import circuits from "../app/circuits.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const padNum = (num: number, zeros: number) => {
  return String(num).padStart(zeros, "0")
}

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
  const rand = gen.create("seed")

  while(challenges.length < n) {
    const circuit = circuits[rand.range(circuits.length)]
    const alreadyPicked = challenges.map(c => c.circuit.value).indexOf(circuit.value) > -1
    if(alreadyPicked) continue;

    const options: Challenge["options"] = [{
      name: circuit.name,
      value: circuit.value,
      correct: true
    }]
    
    while(options.length < 4) {
      const opt = circuits[rand.range(circuits.length)]
      const optAlreadyPicked = options.map(o => o.value).indexOf(opt.value) > -1
      if(optAlreadyPicked) continue;

      options.push({
        name: opt.name,
        value: opt.value,
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