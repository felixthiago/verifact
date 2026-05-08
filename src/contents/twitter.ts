console.log('CONTENT SCRIPT LOADED')
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*"],
  run_at: "document_idle"
}

export type TweetExtractionResult = {
  success: boolean
  text?: string
  author?: string
  displayName?: string
  url?: string
  error?: "not_tweet_page" | "no_tweet_found" | "empty_tweet" | "unknown"
}

export function isTweetPage(url: string): boolean {
  try {
    const { pathname } = new URL(url)
    return /^\/\w+\/status\/\d+/.test(pathname)
  } catch {
    return false
  }
}

function extractTweet(): TweetExtractionResult {
  const url = window.location.href

  if (!isTweetPage(url)) {
    return { success: false, error: "not_tweet_page" }
  }

  const articles = document.querySelectorAll<HTMLElement>(
    'article[data-testid="tweet"]'
  )
  console.log(`Found ${articles.length} tweet articles on the page.`)
  console.log(articles)

  if (!articles.length) {
    return { success: false, error: "no_tweet_found" }
  }

  let primaryArticle: HTMLElement | null = null

  for (const article of articles) {
    const isInsideQuote =
      article.closest('[data-testid="quoteTweet"]') !== null ||
      article.closest('div[role="link"]') !== null
    if (!isInsideQuote) {
      primaryArticle = article
      break
    }
  }

  if (!primaryArticle) primaryArticle = articles[0]

  const tweetTextEl = primaryArticle.querySelector<HTMLElement>(
    '[data-testid="tweetText"]'
  )

  const rawText = tweetTextEl?.innerText?.trim() ?? ""

  if (!rawText) {
    return { success: false, error: "empty_tweet" }
  }

  const userNameContainer = primaryArticle.querySelector<HTMLElement>(
    '[data-testid="User-Name"]'
  )

  let displayName = ""
  let author = ""

  if (userNameContainer) {
    const spans = userNameContainer.querySelectorAll<HTMLSpanElement>("span span")
    for (const span of spans) {
      const t = span.textContent?.trim()
      if (!t) continue
      if (!displayName && !t.startsWith("@")) displayName = t
      if (t.startsWith("@") && !author) { author = t; break }
    }
  }

  if (!author) {
    const match = url.match(/(?:twitter|x)\.com\/(@?\w+)\/status\//)
    if (match) author = `@${match[1]}`
  }

  return {
    success: true,
    text: rawText,
    author,
    displayName: displayName || author,
    url
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "EXTRACT_TWEET":
      sendResponse(extractTweet())
      break

    case "IS_TWEET_PAGE":
      sendResponse({ isTweetPage: isTweetPage(window.location.href) })
      break

    default:
      break
  }

  return true
})
