/// <reference types="chrome"/>
import { useState, useEffect } from "react"
import { useStorage } from "@plasmohq/storage/hook"
import { TRUSTED_DOMAINS } from "./constants"
import { VideoText } from "@/components/ui/video-text"
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"
import { TwitterCard } from "@/components/twitter-card"
import type { TweetExtractionResult } from "@/src/contents/twitter"

import X from "url:~assets/x.png"
// @ts-ignore:
import "./style.css"

const BG_VIDEO = "https://files.catbox.moe/nd2pdi.webm"


function isTwitterDomain(hostname: string): boolean {
  return hostname === "twitter.com" || hostname === "x.com"
}

function isTweetStatusUrl(url: string): boolean {
  try {
    const { pathname } = new URL(url)
    return /^\/\w+\/status\/\d+/.test(pathname)
  } catch {
    return false
  }
}

type PopupMode =
  | "default"       
  | "twitter_home"  
  | "twitter_tweet"

export default function IndexPopup() {
  const [domain, setDomain] = useState("")
  const [isTrusted, setIsTrusted] = useState(false)
  const [mode, setMode] = useState<PopupMode>("default")

  const [tweet, setTweet] = useState<TweetExtractionResult | null>(null)
  const [tweetLoading, setTweetLoading] = useState(false)
  const [tweetError, setTweetError] = useState<string | null>(null)

  // Shared storage that the sidepanel watches to auto-trigger analysis
  const [, setDetectedText] = useStorage<string>("detectedText", "")

  useEffect(() => {
    async function init() {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (!tab?.id || !tab.url) return

      const urlObj = new URL(tab.url)
      const hostname = urlObj.hostname.replace(/^www\./, "")
      setDomain(hostname)

      if (isTwitterDomain(hostname)) {
        if (isTweetStatusUrl(tab.url)) {
          setMode("twitter_tweet")
          fetchTweet(tab.id)
          console.log(tab.url)
        } else {
          setMode("twitter_home")
        }
      } else {
        setMode("default")
        setIsTrusted(TRUSTED_DOMAINS.includes(hostname))
      }
    }
    init()
  }, [])

  async function fetchTweet(tabId: number) {
    setTweetLoading(true)
    setTweetError(null)
    try {
      const result: TweetExtractionResult = await chrome.tabs.sendMessage(tabId, {
        type: "EXTRACT_TWEET"
      })
      if (result?.success) {
        setTweet(result)
      } else {
        await new Promise((r) => setTimeout(r, 1200))
        const retry: TweetExtractionResult = await chrome.tabs.sendMessage(tabId, {
          type: "EXTRACT_TWEET"
        })
        if (retry?.success) {
          setTweet(retry)
        } else {
          setTweetError(
            retry.error === "not_tweet_page"
              ? "Abra um post específico para verificar."
              : "Não foi possível ler o conteúdo do post. Tente recarregar a página."
          )
        }
      }
    } catch (err: any){
      setTweetError(
        "Não foi possível acessar o conteúdo do post. O Twitter/X pode exigir login para visualizar este tweet. ",
      );
      console.log(err);
    } finally {
      setTweetLoading(false)
    }
  } 

  async function handleVerifyTweet() {
    if (!tweet?.text) return
    await setDetectedText(tweet.text)

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id })
      window.close()
    }
  }

  async function handleSidePanel() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      chrome.sidePanel.open({ tabId: tab.id })
      window.close()
    }
  }

  if (mode === "twitter_home") {
    return (
      <PopupShell>
        <div className="mt-4 p-4 rounded-xl border border-white/10 bg-white/5 text-center space-y-2">
          <img src = {X} alt="twitter icon" className="mx-auto" width={128} height={128} />
          <p className="text-sm font-semibold text-white/80">Twitter / X</p>
          <p className="text-xs text-white/40 leading-relaxed">
            Abra um post específico para verificar o conteúdo.
          </p>
        </div>
      </PopupShell>
    )
  }

  if (mode === "twitter_tweet") {
    return (
      <PopupShell>
        <TwitterCard
          tweet={tweet}
          loading={tweetLoading}
          error={tweetError}
          onVerify={handleVerifyTweet}
        />
      </PopupShell>
    )
  }

  return (
    <div className="relative w-[350px] min-h-[300px] flex flex-col items-center justify-center overflow-hidden bg-white opacity-90 font-sans shadow-2xl">
      <div className="p-8 w-[350px] min-h-[100px] text-center font-sans rounded-full">
        <div className="relative h-[100px] w-full overflow-hidden">
          <VideoText src={BG_VIDEO} fontSize={24} fontWeight={800} fontFamily="Poppins">
            VeriFact
          </VideoText>
        </div>

        <div
          className={`mt-4 p-4 rounded-lg ${
            isTrusted ? "bg-success" : "bg-danger"
          } transition-colors duration-300 ease-in-out`}
        >
          <h2 className="m-auto text-base font-bold text-white">
            {isTrusted ? "Fonte Confiável!" : "Fonte Desconhecida!"}
          </h2>
          <p
            className={`text-sm opacity-90 ${
              isTrusted ? "text-secureLink" : "text-unsafeLink"
            } cursor-pointer`}
          >
            {domain}
          </p>
        </div>

        {!isTrusted && (
          <InteractiveHoverButton className="mt-3 bg-white" onClick={handleSidePanel}>
            Verificar!
          </InteractiveHoverButton>
        )}
      </div>
    </div>
  )
}

function PopupShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[350px] min-h-[280px] flex flex-col overflow-hidden bg-[#0a0a0a] font-sans shadow-2xl p-5 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold  bg-gradient-to-b from-white to-gray-500 bg-clip-text text-transparent">
          VeriFact <span className="text-[#2596be] text-xs font-mono italic">(demo)</span>
        </h1>
        <span className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
          Twitter / X
        </span>
      </header>
      {children}
    </div>
  )
}
