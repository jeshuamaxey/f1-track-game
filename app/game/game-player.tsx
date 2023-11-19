"use client";

import { AnimatePresence, AnimationPlaybackControls, motion, useAnimate } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, roundTo } from "@/lib/utils";
import circuits from "../circuits.json"

const DURATION = 2 // seconds to draw the circuit

const padNum = (num: number, zeros: number) => {
  return String(num).padStart(zeros, "0")
}

type Circuit = {
  name: string
  type: "polygon" | "path"
  viewBox: string
  path: string
}

type Challenge = {
  circuit: Circuit,
  options: {
    name: string,
    value: string,
    correct: boolean
  }[]
}

type Guess = {
  option: Challenge["options"][0],
  elapsed: number
  percentComplete: number
}

const GamePlayer = ({}) => {
  const [svgScope, svgAnimate] = useAnimate()

  const [circuitIndex, setCircuitIndex] = useState(0)
  
  const [gameStarted, setGameStarted] = useState(false)
  const [correctGuess, setCorrectGuess] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [guesses, setGuesses] = useState<Guess[]>([])

  const [animations, setAnimations] = useState<{[key: string]: AnimationPlaybackControls}>({})
  
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout>()
  const [elapsed, setElapsed] = useState(0)
  const [guessMade, setGuessMade] = useState(false)

  // const rotation = `rotate(${Math.random()*360})`
  const rotation = undefined

  const gameData = {
    challenges: [
    {
      circuit: circuits[3],
      options: [{
        name: "🦅 COTA",
        value: "usa_cota",
        correct: false
      }, {
        name: "🇬🇧 Silverstone",
        value: "uk_silverstone",
        correct: false
      }, {
        name: "🦘 Albert Park",
        value: "australia_albert_park",
        correct: true
      }, {
        name: "🇯🇵 Suzuka",
        value: "japan_suzuka",
        correct: false
      }]
    },
    {
      circuit: circuits[4],
      options: [{
        name: "🦅 COTA",
        value: "usa_cota",
        correct: false
      }, {
        name: "🇬🇧 Silverstone",
        value: "uk_silverstone",
        correct: false
      }, {
        name: "🛥️ Yas Marina",
        value: "abu_dhabi_yas_marina",
        correct: true
      }, {
        name: "🇯🇵 Suzuka",
        value: "japan_suzuka",
        correct: false
      }]
    },
    // {
    //   circuit: circuits[1],
    //   options: [{
    //     name: "🦅 COTA",
    //     value: "usa_cota",
    //     correct: false
    //   }, {
    //     name: "🇬🇧 Silverstone",
    //     value: "uk_silverstone",
    //     correct: false
    //   }, {
    //     name: "🎲 Vegas",
    //     value: "usa_vegas",
    //     correct: false
    //   }, {
    //     name: "🛥️ Miami",
    //     value: "usa_miami",
    //     correct: true
    //   }]
    // }
    ]
  }

  const startGame = () => {
    console.log("start game")
    // set up clock
    const startTime = new Date().getTime()
    setTimerInterval(setInterval(() => {
      setElapsed(new Date().getTime() - startTime)
    }, 23))

    // setup animations
    const game = svgAnimate(
      "#revealed-track",
      {
        pathLength: 1
      },
      {
        duration: DURATION,
        autoplay: false
      }
    );
    const completion = svgAnimate(
      "#bg-track",
      {
        pathLength: 1
      },
      {
        duration: 1,
        autoplay: false
      }
    );

    setAnimations({
      game, 
      completion
    })

    // lights out and away we go...
    setGameStarted(true)
    game.play()
  }

  const handleGuess = (option: Challenge["options"][0]) => {
    clearTimeout(timerInterval)
    setGuessMade(true)
    setCorrectGuess(option.correct)

    const guess = {
      option,
      elapsed,
      percentComplete: Math.min(roundTo(elapsed / (DURATION * 1000), 2), 1)
    }

    console.log("guess", guess)

    setGuesses([...guesses, guess])

    animations.game.pause()
    animations.completion.play()
  }

  const handleNextStep = () => {
    if(circuitIndex < gameData.challenges.length-1) {
      console.log("resetting game...")

      setCircuitIndex(circuitIndex+1)
      setGameStarted(false)
      setGuessMade(false)
      setElapsed(0)
    } else {
      console.log("game over")
      setGameOver(true)
    }
  }

  const renderElapsed = (t: number) => {
    const ms = t % 1000
    const secs = (t-ms)/1000 % 60
    const mins = (t-ms-(1000*secs))/60000
    return `${padNum(mins, 2)}:${padNum(secs, 2)}.${padNum(ms, 3)}`
  }

  const timer = renderElapsed(elapsed)

  return (
    <div className="min-h-screen h-screen w-full bg-slate-900">
      <div className="flex flex-row p-4">
        <div className="text-slate-50">Track {circuitIndex+1} / {gameData.challenges.length}</div>
        <div className="flex-grow"></div>
        <div className="text-slate-50 tabular-nums">{timer}</div>
      </div>

      {!gameStarted && (
        <div className="flex flex-row p-4">
          <Button variant="outline" className="mx-auto" onClick={() => startGame()}>Start</Button>
        </div>
      )}

      <motion.svg
        ref={svgScope}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={gameData.challenges[circuitIndex].circuit.viewBox}
        >
        <motion.path
          key={`bg-${circuitIndex}`}
          className={gameStarted ? "visible" : "hidden"}
          id="bg-track"
          d={gameData.challenges[circuitIndex].circuit.d}
          fill="none"
          strokeWidth="8"
          stroke="white"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          />
        <motion.path
          key={`reveal-${circuitIndex}`}
          className={gameStarted ? "visible" : "hidden"}
          id="revealed-track"
          d={gameData.challenges[circuitIndex].circuit.d}
          fill="none"
          strokeWidth="8"
          // red-500
          stroke="#dc2626"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          />
      </motion.svg>

      <AnimatePresence>
      {guessMade && !gameOver && (
        <motion.div className={cn(
          "absolute top-0 w-full h-full flex flex-col justify-center",
          !guessMade && "pointer-events-none",
          correctGuess ? "bg-green-500" : "bg-red-500"
          )}
          initial={{ top: 20, opacity: 0 }}
          animate={{ top: 0, opacity: 1, transition: { delay: 1 } }}
          >
          {correctGuess ?
            <h1 className="mx-auto text-center text-background text-3xl">🏁 Correct!</h1> :
            <h1 className="mx-auto text-center text-background text-3xl">🚩 Incorrect</h1>
          }
          {circuitIndex < gameData.challenges.length &&
            <Button
              className="mx-auto mt-4"
              variant="outline"
              onClick={() => handleNextStep()}
              >
              Next circuit
            </Button>
          }
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {gameOver && (
        // TODO: extract this into a game summary component
        <motion.div className={cn(
          "absolute top-0 w-full h-full flex flex-col justify-center bg-foreground text-background",
          )}
          initial={{ top: 20, opacity: 0 }}
          animate={{ top: 0, opacity: 1, transition: { delay: 0 } }}
          >
          <h1 className="mx-auto text-center text-3xl pb-8">🏁 Game over!</h1>

          <div className="flex flex-col p-4">
            {gameData.challenges.map((challenge, index) => {
              const name = challenge.options.find(option => option.correct)!.name
              const guess = guesses[index]

              const revealDuration = 2

              return <div key={challenge.circuit.viewBox} className="flex flex-row gap-4 py-4">
                <div className="w-1/2">
                  <motion.svg viewBox={challenge.circuit.viewBox}>
                    <motion.path id="result-bg-track"
                      transform={rotation}
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      stroke="white"
                      strokeWidth={4}
                      d={challenge.circuit.d}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{duration: revealDuration}}
                    />
                    <motion.path
                      id="result-revealed-track"
                      transform={rotation}
                      vectorEffect="non-scaling-stroke"
                      fill="none"
                      // red-600
                      stroke="#dc2626"
                      strokeWidth={4}
                      d={challenge.circuit.d}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: guess.percentComplete }}
                      transition={{duration: guess.percentComplete*revealDuration}}
                    />
                  </motion.svg>
                </div>
                <div className="w-1/2">
                  <h3 className={guess.option.correct ? "bg-green-500" : "bg-red-500"}>{name}</h3>
                  <h3>{renderElapsed(guess.elapsed)}</h3>
                  <h3>{guess.percentComplete*100}%</h3>
                </div>
              </div>
              })}
          </div>

          <div className="p-4">
            <p className="text-center">{guesses.filter(g => g.option.correct).length}/{gameData.challenges.length} circuits in {roundTo(guesses.reduce((total, guess) => total+(guess.elapsed/1000), 0), 2)}</p>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {gameStarted && !guessMade && (
        <motion.div className="flex flex-row p-4 gap-4 flex-wrap">
          {gameData.challenges[circuitIndex].options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              disabled={guessMade}
              onClick={() => handleGuess(option)}
              >
              {option.name}
            </Button>
          ))}
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default GamePlayer
