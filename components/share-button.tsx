import { Button } from "./ui/button"

const ShareButton = () => {
  const share = () => {
    // if(navigator.share) {
      navigator.share({
        text: `HELLO
        MULTI LINE
        SHARE`
      })
    // } else {
      // alert("share api not supported")
      // console.log("TODO: implement fallback if share API not supported")
    // }
  }
  return <Button onClick={() => share()} variant="secondary">Share</Button>
}

export default ShareButton