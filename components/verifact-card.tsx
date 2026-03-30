import { cn } from "@/lib/utils";
import { VerifactResponse } from "@/types";
import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink} from "lucide-react";

export const VerifactCard = (data: VerifactResponse) => {
    console.log(data)
    const config = {
        VERIFICADO: {color: "text-status-verified", border: "border-status-verified/30", icon: CheckCircle2},
        FALSO: {color: "text-status-false", border: "border-status-false/30", icon: AlertCircle},
        "PARCIALMENTE VERIFICADO": {color: "text-status-partial", border: "border-status-partial/30", icon: HelpCircle},
        "NAO VERIFICADO": {color: "text-status-unknown", border: "border-status-unknown/30", icon: HelpCircle},
    }[data.verification] || {color: "text-status-unknown", border: "border-status-unknown/30", icon: HelpCircle}
    console.log(config)
    const Icon = config.icon

    return (
        <div className = {cn("relative group overflow-hidden rounded-2xl border p-5 transition-all duration-500",
            "bg-white/5 backdrop-blur-md",
            config.border,
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]")}>
            <div className = "absolute inset-0 bg-gradient-to-br from white/10 to-transparent pointer-events-none">

                <div className = "relative z-10 space-y-4">
                    <header className = "flex items-center justify-between">

                        <div className = "flex items-center gap-2">
                            <Icon className = {cn("w-6 h-6", config.color)} />
                            <span className = {cn("font-bold tracking-tight uppercase text-sm", config.color)}>
                                {data.verification}
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className = "text-[10px] font-mono text-white/40 uppercase tracking-widest">
                                Nível de confiança
                            </span>
                            <span className = "text-[14px] font-bold text-white/70">{data.confidence}</span>
                        </div>
                    </header>

                    <p className = "text-gray-200 text-sm leading-relaxed font-medium">
                        {data.explanation}
                    </p>

                    {data.sentiment && (
                        <div className="inline-block px-2 py-0.5 rounded-full bg-white/10 border border-white/5">
                            <span className="text-[10px] text-white/50 uppercase font-bold italic">
                                Tom: {data.sentiment}
                            </span>
                        </div>
                    )}

                    {data.sources.length > 0 && (
                        <footer className = "pt-4 border-t border-white/10 space-y-2">
                            <span className = "text-[10px] font-bold text-white/30 uppercase" >Fontes Oficiais</span>
                            <div className = "flex flex-col gap-2">
                                {data.sources.map((url, i) => (
                                    <a 
                                    key = {i}
                                    href = {url}
                                    target = "_blank"
                                    rel = "noopener noreferrer"
                                    className = "group/link flex items-center justify-between text-xs text-purple-400 hover:text-purple-300 truncate transition-colors bg-white/5 p-2 rounded-lg border border-white/5"
                                    >
                                        {url}
                                        <span className="truncate max-w-[200px]">{url}</span>
                                       <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                    </a>

                                ))}
                            </div>
                        </footer>
                    )}

                </div>
            </div>
        </div>

    )
}