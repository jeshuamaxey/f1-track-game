import Navbar from "@/components/navbar";
import ThanksScreen from "./thanks-screen";

export default async function Thanks() {
  return (
    <div className="flex-1 w-full flex flex-col gap-4 items-center">
      <Navbar />
      <ThanksScreen />
    </div>
  )
}
