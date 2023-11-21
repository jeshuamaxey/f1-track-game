import dynamic from "next/dynamic";

// disable SSR for game player as game state can be stored in local storage
const GamePlayer = dynamic(() => import('./game-player'), { ssr: false })

export default async function Index() {
  return <GamePlayer />
}