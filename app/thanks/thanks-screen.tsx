"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeftIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"
import Link from "next/link"

const ThanksScreen = () => {
  return (
    <div className="container p-4 flex flex-col">
    <div className="flex flex-row">
      <Button asChild variant="outline">
        <Link href="/">
          <ChevronLeftIcon className="h-4 w-4" /> Back
        </Link>
      </Button>
      </div>

      <motion.div className="pl-4 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0 }}>
        <p className="text-xl text-foreground/80 font-f1-bold pb-2">Thanks</p>
        <p className="text-sm text-foreground/80 pb-2">This project would not have been possible without the following contributions</p>
      </motion.div>

      <motion.div className="pl-4 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}>
        <p className="text-xl text-foreground/80 font-f1-bold pb-2">F1 Laps</p>
        <p className="text-sm text-foreground/80 pb-2">F1 Laps created and (released for free!) the necessary data on the shape of many of the tracks. Thank you.</p>
        <Button variant="secondary" asChild><Link target="_blank" href="https://www.f1laps.com/">Checkout F1 laps</Link></Button>
      </motion.div>

      <motion.div className="pl-4 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}>
        <p className="text-xl text-foreground/80 font-f1-bold pb-2">Smithographic</p>
        <p className="text-sm text-foreground/80 pb-2">Smithographic surfaced links to free versions of the F1 fonts which this site uses (it's not the offical font, but it's a close match)</p>
        <Button variant="secondary" asChild><Link target="_blank" href="https://imjustcreative.com/">Checkout Smithographic</Link></Button>
      </motion.div>

      <motion.div className="pl-4 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}>
        <p className="text-xl text-foreground/80 font-f1-bold pb-2">YOU!</p>
        <p className="text-sm text-foreground/80 pb-2">Thank you for checking out this game a playing. It means a lot to me. If you enjoyed this game, consider supporting me to make more things like this</p>
        <Button variant="secondary" asChild><Link target="_blank" href="https://buy.stripe.com/cN229p9UPdTo3tu5kk">Contribute</Link></Button>
      </motion.div>
    </div>
  )
}

export default ThanksScreen