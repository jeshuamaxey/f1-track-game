import dynamic from "next/dynamic";

import Navbar from "@/components/navbar";

// disable SSR for game player as game state can be stored in local storage
const HomeScreen = dynamic(() => import('@/components/home-screen'), { ssr: false })

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <Navbar />
      <HomeScreen />
    </div>
  )
}
