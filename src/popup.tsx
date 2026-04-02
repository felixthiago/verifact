import { useState, useEffect } from "react";
import  { TRUSTED_DOMAINS } from './constants';
// import { ShimmerButton } from "~components/ui/shimmer-button";
import { VideoText } from "@/components/ui/video-text";

import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

import "./style.css"

const bg_text_video = "https://files.catbox.moe/nd2pdi.webm"

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
    <div className = "relative w-[350px] min-h-[300px] flex flex-col items-center justify-center overflow-hidden bg-white opacity-90font-sans shadow-2xl">
      <div className = "p-8 w-[350px] min-h-[100px] text-center font-sans rounded-full">
        <div className="relative h-[100px] w-full overflow-hidden">
          <VideoText src = {bg_text_video} fontSize={24} fontWeight={800} fontFamily = {'Poppins'}>
            VeriFact
          </VideoText>
        </div>
        
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