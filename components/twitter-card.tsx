import { Loader2, X, AlertTriangle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TweetExtractionResult } from "@/src/contents/twitter"

import { ClientTweetCard } from "@/components/ui/client-tweet-card"

interface TwitterCardProps {
  tweet: TweetExtractionResult | null
  loading: boolean
  error: string | null
  onVerify: () => void
}

export const TwitterCard = ({ tweet, loading, error, onVerify }: TwitterCardProps) => {
  const tweetId = tweet?.url?.match(/\/status\/(\d+)/)?.[1]
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-white/40">
        <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
        <p className="text-xs">Detectando post...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-center space-y-2">
        <div className="flex items-center gap-2 text-yellow-400">
          <AlertTriangle className="mx-auto shrink-0" width={128} height={128} />
        </div>
        <p className="text-xs text-white/50 leading-relaxed">{error}</p>
      </div>
    )
  }
  if (!tweet?.success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8 text-white/20">
        <X className="w-6 h-6" />
        <p className="text-xs text-center">Nenhum post detectado.</p>
      </div>
    )
  }
  return (
    <div
      className={cn(
        "backdrop-blur-sm p-4 space-y-4 animate-in fade-in zoom-in duration-300"
      )}
    >
      <ClientTweetCard id = {tweetId || "" } className={cn(
      "m-0 max-w-full bg-transparent border-white/10",
      "[&_*]:!text-white/80", 
      "[&_p]:!text-white",
      "[&_p]:line-clamp-3 [&_p]:overflow-hidden",
      "[&_svg]:!text-[#1ed5fc] [&_svg]:!fill-[#1ed5fc]"
  )}/>
      <button
        onClick={onVerify}
        className={cn(
          "w-full py-2.5 rounded-xl text-xs font-bold transition-all",
          "bg-[#1ed5fc] hover:bg-[#00a3d5] active:scale-[0.98] text-white",
          "flex items-center justify-center gap-2"
        )}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Verificar post
      </button>
    </div>
  )
}
