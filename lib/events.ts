const EVENTS = {
  game_started: "game_started",
  guess_made: "guess_made",
  game_completed: "game_completed",

  unknown_error: "unknown_error",
} as const

export type EventName = (typeof EVENTS)[keyof typeof EVENTS]

export default EVENTS
