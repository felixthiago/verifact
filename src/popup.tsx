import { useState, useEffect } from "react";
import  { TRUSTED_DOMAINS } from './constants';
// import { ShimmerButton } from "~components/ui/shimmer-button";
import { VideoText } from "@/components/ui/video-text";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

import "./style.css"

const bg_text_video = "https://cdn.discordapp.com/attachments/1438673501740601355/1488154675789299793/97e7c21b1e9ba1725b150f6b40c2192c.webm?ex=69cbbf8b&is=69ca6e0b&hm=852516473674fade9896a007d55b4d4b45c6dae1c6c5814d6d8ada20dcd9eab3&"

function IndexPopup() {
  const [domain, setDomain] = useState("")
  const [isTrusted, setIsTrusted] = useState(false)
  // const [twitterText, setTwitterText] = useState("")

  useEffect(() => {
    async function init() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id || !tab.url) return

      const urlObj = new URL(tab.url)
      const current = urlObj.hostname.replace(/^www\./, "")
      setDomain(current)
      setIsTrusted(TRUSTED_DOMAINS.includes(current))

      // if (current === "twitter.com" || current === "x.com") {
      //   chrome.scripting.executeScript({
      //     target: { tabId: tab.id },
      //     func: () => {
      //       const tweetElement = document.querySelector('[data-testid="tweetText"]')
      //       console.log("tweet found >> ", tweetElement)
      //       return tweetElement ? tweetElement.innerHTML : ""
      //     }
      //   }, (results) => {
      //     if (chrome.runtime.lastError){
      //       console.log("Erro de permissão ou de script: ", chrome.runtime.lastError.message);
      //       return;
      //     }
      //     if (results?.[0]?.result) setTwitterText(results[0].result)
      //   })
      // }

    }
    init()
  }, [])

  async function handleSideBAR(){
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log(tab.id)
    if (tab.id) { 
      chrome.sidePanel.open({ tabId: tab.id})
      window.close()
    }
  }

  return (
    <div className = "">
      <div className = " p-8 w-[350px] min-h-[100px] text-center font-sans rounded-full">
        <div className="relative h-[100px] w-full overflow-hidden">
          <VideoText src = {bg_text_video}>
            VeriFact
          </VideoText>
        </div>
        {/* <h1 className = 'text-4xl font-semibold'>Verifact</h1> */}
        
        <div className = {`mt-4 p-4 rounded-lg ${isTrusted ? "bg-success" : "bg-danger"} transition-colors duration-300 ease-in-out`}>
          <h2 className = {`m-auto text-base font-bold text-white`}>  
            {isTrusted ? "Fonte Confiavel!" : "Fonte Desconhecida!"}
          </h2>
          <p className = {`text-sm opacity-90 ${isTrusted ? "text-secureLink" : "text-unsafeLink"} cursor-pointer`} >
            {domain}
          </p>  
        </div>
        
        {!isTrusted && (
          <InteractiveHoverButton className = "mt-3 bg-white" onClick = { handleSideBAR }>Verificar!</InteractiveHoverButton>
        )}
      </div>
    </div>
  )
}

export default IndexPopup