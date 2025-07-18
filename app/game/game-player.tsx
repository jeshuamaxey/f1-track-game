"use client";

export const dynamic = "force-dynamic"


import { AnimatePresence, AnimationPlaybackControls, motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, generateChallenges, getDateKey, getScoreEmojis, renderElapsed, roundTo } from "@/lib/utils";
import SummarySplash from "./summary-splash";
import { Challenge, sbDailyResult } from "../types/app";
import GuessSummary from "./guess-summary";
import config from "../config.json"
import useGameState from "@/lib/useGameState";
import { User } from "@supabase/supabase-js";
import useAnalytics from "@/lib/useAnalytics";
import EVENTS from "@/lib/events";

const challenges = generateChallenges(config.N_CHALLENGES)

type GamePlayerProps = {
  dailyResults: sbDailyResult[],
  user?: User | null
}

const GamePlayer = ({dailyResults, user}: GamePlayerProps) => {
  const analytcs = useAnalytics()

  const todaysDateKey = getDateKey()
  const todaysGame = dailyResults.find(res => res.date_key === todaysDateKey)
  
  const [gameState, saveGame] = useGameState({dailyResults, user})
  const {guesses, circuitIndex} = gameState

  const [svgScope, svgAnimate] = useAnimate()

  const [lightsInterval, setLightsInterval] = useState<NodeJS.Timeout>()
  const [lightsStarted, setLightsStarted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [lightsIndex, setLightsIndex] = useState(0)
  const [correctGuess, setCorrectGuess] = useState(false)
  const [gameOver, setGameOver] = useState(todaysGame || guesses.length === challenges.length)

  const [animations, setAnimations] = useState<{[key: string]: AnimationPlaybackControls}>({})
  
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout>()
  const [elapsed, setElapsed] = useState(0)
  const [guessMade, setGuessMade] = useState(guesses.length === challenges.length)

  const startGame = () => {
    console.log("start game")

    if(circuitIndex === 0) {
      analytcs.capture(EVENTS.game_started, { dateKey: todaysDateKey})
    }

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
        duration: config.DURATION,
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
    clearInterval(timerInterval)
    setGuessMade(true)
    setCorrectGuess(option.correct)

    const guess = {
      option,
      elapsed,
      percentComplete: Math.min(roundTo(elapsed / (config.DURATION * 1000), 2), 1)
    }

    console.log("guess made", guess)

    analytcs.capture(EVENTS.guess_made, { guess })

    saveGame({guesses: [...guesses, guess]})

    animations.game.pause()
    animations.completion.play()
  }

  const handleNextStep = () => {
    if(circuitIndex < challenges.length-1) {
      console.log("resetting game...")

      saveGame({ circuitIndex: circuitIndex+1 })
      setGameStarted(false)
      setGuessMade(false)
      setElapsed(0)
      setLightsIndex(0)
      startLights()
    } else {
      console.log("game over")
      analytcs.capture(EVENTS.game_completed, { dateKey: todaysDateKey})
      setGameOver(true)
    }
  }

  const startLights = () => {
    console.log("start lights")
    setLightsStarted(true)

    const interval = setInterval(() => {
      setLightsIndex((prev) => prev+1)
    }, 700)

    setLightsInterval(interval)
    return () => clearInterval(interval);
  }

  // kick off the lights
  if(guesses.length !== challenges.length && !lightsStarted) {
    startLights()
  }

  // stop lights after index reaches 5
  useEffect(() => {
    if(lightsIndex === 6) {
      console.log("stop lights")
      startGame()
      clearTimeout(lightsInterval)
    }
  }, [lightsIndex])

  const timer = renderElapsed(elapsed)
  const scoreEmojis = getScoreEmojis(challenges.length, guesses)

  return (
    <div className="min-h-screen max-h-screen h-screen w-full flex flex-col bg-slate-950">
      {/* TIMER */}

      <motion.div className="flex flex-row h-14 p-4"
        initial={{y: -40}}
        animate={{y: 0}}
        >
        <div className={cn("text-slate-50", guessMade ? "hidden" : "visible")}>{scoreEmojis}</div>
        <div className="flex-grow"></div>
        <div className="text-slate-50 tabular-nums">{timer}</div>
      </motion.div>


      {/* CIRCUIT */}
      <div className="h-1/2 w-full px-2 flex flex-row items-center bg-slate-900">
        <motion.svg
          ref={svgScope}
          className={cn("max-w-full max-h-full mx-auto", gameStarted ? "visible" : "hidden")}
          xmlns="http://www.w3.org/2000/svg"
          width="2560"
          viewBox={challenges[circuitIndex].circuit.viewBox}
          >
          <motion.path
            key={`bg-${circuitIndex}`}
            className={gameStarted ? "visible" : "hidden"}
            id="bg-track"
            d={challenges[circuitIndex].circuit.d}
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
            d={challenges[circuitIndex].circuit.d}
            fill="none"
            strokeWidth="8"
            // red-500
            stroke="#dc2626"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            />
        </motion.svg>

        {/* START LIGHTS */}
        <AnimatePresence>
          {!gameStarted && (
            <motion.div className="flex flex-row h-full items-center w-full"
              initial={{y: -40, opacity: 0}}
              animate={{y: 0, opacity: 1}}
              transition={{delay: 0.1}}>
              <img className="mx-auto" src={`./lights/start-lights-${lightsIndex}.svg`} alt="F1 start lights" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OPTION BUTTONS */}
      <AnimatePresence>
      {gameStarted && !guessMade && (
        <div className="flex flex-row max-h-50 px-4 py-4 gap-2 flex-wrap justify-center w-full overflow-y-scroll">
          {challenges[circuitIndex].options.map((option, index) => (
            <motion.div key={index}
            className="relative"
            initial={{ top: 20, opacity: 0 }}
            animate={{ top: 0, opacity: 1, transition: { delay: index*0.1 } }}
            >
              <Button
                size="sm"
                variant="outline"
                disabled={guessMade}
                onClick={() => handleGuess(option)}
                >
                {option.flag} {option.name}
              </Button>
            </motion.div>
          ))}
        </div>
      )}
      </AnimatePresence>

      {/* GUESS MADE */}
      <AnimatePresence>
      {guessMade && !gameOver && (
        <motion.div className={cn(
            "absolute top-0 w-full h-full min-h-full",
            !guessMade && "pointer-events-none",
            correctGuess ? "bg-green-500" : "bg-red-500"
          )}
          initial={{ top: 20, opacity: 0 }}
          animate={{ top: 0, opacity: 1, transition: { delay: 1 } }}
          >
            <GuessSummary
              guess={guesses.at(-1)}
              next={handleNextStep}
              gameOver={guesses.length === challenges.length}
              correctOption={challenges[circuitIndex].options.find(o => o.correct)!}/>
        </motion.div>
      )}
      </AnimatePresence>

      {/* GAME OVER */}
      <AnimatePresence>
      {gameOver && (
        <motion.div className={cn(
          "absolute top-0 w-full h-full",
          )}
          initial={{ top: 20, opacity: 0 }}
          animate={{ top: 0, opacity: 1, transition: { delay: 0 } }}
          >
          <SummarySplash challenges={challenges} guesses={guesses} />
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}

export default GamePlayer
