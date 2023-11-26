"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "./ui/button"
import circuits from "../app/circuits.json"
import config from "../app/config.json"
import useGameState from "@/lib/useGameState"
import Link from "next/link"
import { sbDailyResult } from "@/app/types/app"
import { getDateKey } from "@/lib/utils"

const silverstone = circuits.find(c => c.value === "uk_silverstone")!

type HomeScreenProps = {
  dailyResults: sbDailyResult[] | null
}

const HomeScreen = ({dailyResults}: HomeScreenProps) => {
  const router = useRouter()
  const [gameState, ] = useGameState({
    dailyResults: dailyResults || []
  })

  const todaysDateKey = getDateKey()
  const todaysGame = dailyResults ? dailyResults.find(res => res.date_key === todaysDateKey) : undefined

  const [startingGame, setStartingGame] = useState(false)

  const startGame = () => {
    setStartingGame(true)
    setTimeout(() => {
      router.push('/game')
    }, 2000)
  }

  let btnCopy = "Timing sheet"
  if(!todaysGame && gameState.guesses.length < config.N_CHALLENGES) btnCopy = "Continue" 
  if(!todaysGame && gameState.guesses.length === 0) btnCopy = "Play"

  return (
    <div className="w-full flex flex-col gap-8 items-center">
      <div className="text-center h-26">
        <AnimatePresence>
          {!startingGame && (
            <div className="text-center h-26">
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{duration: 0.8, delay: 0}}>
                <h1 className="text-3xl font-f1-bold leading-loose">Identify 3 F1 circuits</h1>
              </motion.div>
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{duration: 0.8, delay: 0.2}}>
              <h3 className="text-sm font-f1-bold leading-loose">New game daily</h3>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
    </div>
      
    <AnimatePresence>
    {!startingGame && (
    <motion.div className="w-64 h-64 flex pb-8 p-2 relative bg-slate-900 rounded-md"
      exit={{ opacity: 0, y: -40 }}
      transition={{ ease: "easeOut", duration: .8, delay: 0.4 }}>
      <motion.svg
        className="max-w-full max-h-full mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        viewBox={silverstone.viewBox}
        >
        <motion.path
          id="bg-track"
          d={silverstone.d}
          fill="none"
          strokeWidth="8"
          stroke="white"
          strokeLinecap="round"
          animate={{ pathLength: [0, 0.5, 1] }}
          transition={{repeat: Infinity, repeatType: "loop", repeatDelay: 4, duration: 13, type: "tween", ease: "easeIn", times: [0, 12/13, 1] }}
          />
        <motion.path
          id="revealed-track"
          d={silverstone.d}
          fill="none"
          strokeWidth="8"
          // red-500
          stroke="#dc2626"
          strokeLinecap="round"
          animate={{ pathLength: [0, 0.5, 0.5] }}
          transition={{repeat: Infinity, repeatType: "loop", repeatDelay: 4,  duration: 13, ease: "easeIn", times: [0, 12/13, 1] }}
          />
      </motion.svg>
      <motion.div className="absolute w-full bottom-0">
        <div className="relative w-full h-8 overflow-hidden">
          <motion.div className="absolute bottom-0 text-slate-400"
            animate={{opacity: [0, 0, 1, 1, 0, 0], left: [-30, -30, 0, 0, 0, 0], bottom: [0, 0, 0, 0, -30, -30]}}
            transition={{repeat: Infinity, repeatType: "loop", repeatDelay: 4, duration: 13, times: [0, 1/13, 2/13, 5/13, 6/13, 1]}}
            >
            <p className="text-sm p-1">Suzuka 🤔</p>
          </motion.div>
          <motion.div className="absolute bottom-0 text-slate-400"
            animate={{opacity: [0, 0, 1, 1, 0, 0], left: [-30, -30, 0, 0, 0, 0], bottom: [0, 0, 0, 0, -30, -30]}}
            transition={{repeat: Infinity, repeatType: "loop", repeatDelay: 4, duration: 13, times: [0, 6/13, 7/13, 10/13, 11/13, 1]}}
            >
            <p className="text-sm p-1">Interlagos 🤷</p>
          </motion.div>
          <motion.div className="absolute bottom-0"
            animate={{opacity: [0, 0, 1], left: [-30, -30, 0]}}
            transition={{repeat: Infinity, repeatType: "loop", repeatDelay: 4, duration: 13, times: [0, 12/13, 1]}}
            >
            <p className="text-sm p-1">Silverstone 🏁</p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
    )}
    </AnimatePresence>

    <AnimatePresence>
      {!startingGame && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ ease: "easeOut", duration: .4, delay: 0.2 }}>
          <div>
            <Button onClick={startGame}>
              {btnCopy}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    <AnimatePresence>
      {!startingGame && (
        <motion.div
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ ease: "easeOut", duration: .4, delay: 0.2 }}>
          <div className="flex flex-col gap-2 text-xs text-center text-slate-400">
            <p>F1 tracks is not affiliated with F1 in any way.</p>
            <p>It was built by <Link className="underline hover:text-slate-100" href="https://twitter.com/jeshuamaxey">Jeshua Maxey</Link>, a big F1 fan.</p>
            <p><Link className="underline hover:text-slate-100" href="https://buy.stripe.com/cN229p9UPdTo3tu5kk">Support this project.</Link></p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </div>
  )
}

export default HomeScreen