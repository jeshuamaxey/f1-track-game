export type Circuit = {
  name: string
  value: string
  viewBox: string
  d: string
}

export type Challenge = {
  circuit: Circuit,
  options: {
    name: string,
    value: string,
    correct: boolean
  }[]
}

export type Guess = {
  option: Challenge["options"][0],
  elapsed: number
  percentComplete: number
}
