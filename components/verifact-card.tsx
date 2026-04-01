import { cn } from "@/lib/utils";
import { VerifactResponse } from "@/types";
import { CheckCircle2, AlertCircle, HelpCircle, ExternalLink, Sparkles} from "lucide-react";

export const VerifactCard = ({data}: {data: VerifactResponse}) => {
    console.log(data)

    const isC1 = data.category === 'C1'

    console.log(isC1)

    const config = {
        VERIFICADO: {color: "text-status-verified", border: "border-status-verified/30", icon: CheckCircle2},
        FALSO: {color: "text-status-false", border: "border-status-false/30", icon: AlertCircle},
        "PARCIALMENTE VERIFICADO": {color: "text-status-partial", border: "border-status-partial/30", icon: HelpCircle},
        "NAO VERIFICADO": {color: "text-status-unknown", border: "border-status-unknown/30", icon: HelpCircle},
        "C1": {color: "text-purple-400", border: "border-purple-500/30", icon: Sparkles}
    }[isC1 ? "C1" : data.verification] || {color: "text-status-unknown", border: "border-status-unknown/30", icon: HelpCircle}

    const Icon = config.icon

    return (
        <div className={cn(
            "relative w-full rounded-2xl border p-6 transition-all duration-500 bg-white/5 backdrop-blur-md",
            config.border,
            "shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]"
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none rounded-2xl" />

            <div className="relative z-10 space-y-5">
                <header className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 shrink-0">
                        <Icon className={cn("w-6 h-6 shrink-0", config.color)} />
                        <span className={cn("font-bold tracking-tight uppercase text-sm leading-none", config.color)}>
                            {isC1 ? "Análise IA" : data.verification}
                        </span>
                    </div>

                    {!isC1 && (
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest leading-none">
                                Confiança
                            </span>
                            <div className="flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className={cn(
                                            "h-1 w-4 rounded-full",
                                            i < 4 ? "bg-purple-500" : "bg-white/10"
                                        )} 
                                    />
                                ))}
                            </div>
                            <span className="text-[10px] font-bold text-white/60">{data.confidence}</span>
                        </div>
                    )}
                </header>

                <div className="space-y-2">
                    <p className="text-gray-200 text-sm leading-relaxed font-medium break-words whitespace-normal">
                        {isC1 ? (Array.isArray(data.claims) ? data.claims[0] : data.claims ) : (data.explanation)}
                    </p>
                    
                    {data.sentiment && (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] text-white/40 uppercase font-bold italic">
                            Tom: {data.sentiment}
                        </span>
                    )}
                </div>

                {!isC1 && data.sources && data.sources.length > 0 && (
                    <footer className="pt-4 border-t border-white/10 space-y-3">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Fontes Oficiais</span>

                        <div className="flex flex-col gap-2 overflow-hidden ">
                            {data.sources.map((url, i) => {
                                const displayUrl = url.replace('https://', '').replace('www.', '')
                                return (
                                    <a 
                                        key={i} 
                                        href={url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="group/link flex items-center justify-between gap-3 text-[11px] text-purple-400/80 hover:text-purple-300 transition-all bg-white/[0.02] hover:bg-white/[0.04] p-2.5 rounded-xl border border-white/5 overflow-hidden"
                                    >
                                    <span className="truncate flex-1 font-mono">
                                        {displayUrl}
                                    </span>                                    
                                    <ExternalLink className="w-3 h-3 shrink-0 opacity-40 group-hover/link:opacity-100 transition-opacity" />
                                </a>)
                            }
    
                            )}
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};