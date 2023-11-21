"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, animate } from "framer-motion"

import { AspectRatio } from "./ui/aspect-ratio"
import { Button } from "./ui/button"

const AnimateOutWrapper = ({
  children, visible, customMotionProps
}: {
  children: React.ReactNode, visible: boolean, customMotionProps?: {}
}) => {
  const defaultMotionProps = {
    layout: true,
    initial: false,
    animate: { opacity: 1, stagger: .100 },
    exit: { opacity: 0, y: 40 },
    transition: { ease: "easeOut", duration: .400 },
  }

  const motionProps = {
    ...defaultMotionProps,
    ...customMotionProps
  }
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div {...motionProps}>
          {children}
          </motion.div>
        )}
    </AnimatePresence>
  )
}

const SplashScreen = () => {
  const router = useRouter()
  const [startingGame, setStartingGame] = useState(false)

  const startGame = () => {
    setStartingGame(true)
    setTimeout(() => {
    router.push('/game')
    }, 2000)
  }
  
  return (
    <div className="w-full flex flex-col gap-20 items-center">
      <AnimateOutWrapper visible={!startingGame}>
        <div className="text-center">
          <h1 className="text-3xl font-f1-bold leading-loose">Identify 3 F1 circuits</h1>
          <h2 className="text-3xl font-f1-bold leading-loose">Fastest wins</h2>
          <h3 className="font-f1-bold leading-loose">New game daily</h3>
        </div>
      </AnimateOutWrapper>
      
      <div className="w-64 h-64 px-8">
        <AnimateOutWrapper visible={!startingGame} customMotionProps={{
          exit: { transform: "scale(4)"},
          transition: { ease: "easeOut", duration: 1.500 }
        }}>
          <AspectRatio ratio={16 / 9}>
            <div className="w-full h-full flex bg-slate-950">
              <p className="w-full text-center m-auto">
                game preview here
              </p>
            </div>
          </AspectRatio>
        </AnimateOutWrapper>
      </div>

      <AnimateOutWrapper visible={!startingGame}>
        <div>
          <Button onClick={startGame}>Play</Button>
        </div>
      </AnimateOutWrapper>
    </div>
  )
}

export default SplashScreen