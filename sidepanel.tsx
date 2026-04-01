import '@/src/style.css'
import { useState, useEffect, useRef } from 'react'
import { useStorage } from "@plasmohq/storage/hook"
import { VerifactResponse } from './types'

import { cn } from '@/lib/utils'
import { InteractiveGridPattern } from './components/ui/interactive-grid-pattern'
import { ShimmerButton } from './components/ui/shimmer-button'

import { VerifactCard } from './components/verifact-card'
import { ActionCard } from './components/action-card'

const API_URL = "http://127.0.0.1:8000/check"

export default function SidePanel(){
    const [loading, setLoading] = useState(false);
    const [textToVerify, setTextToVerify] = useStorage<string>('detectedText', '');
    const [result, setResult] = useState<VerifactResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const lastAnalyzed = useRef(""); 

    useEffect(() => {
        const analyze = async () => {
            if (textToVerify && textToVerify !== lastAnalyzed.current && !loading) {
                lastAnalyzed.current = textToVerify;
                await handleClaim(textToVerify);
            }
        };
        analyze();
    }, [textToVerify]);

    const handleClaim = async (raw_text: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({text: raw_text})
            })

            if (!res.ok) throw new Error("erro na resposta da api!")
            const data = await res.json()
            setResult(data)
        } catch (error) {
            setError(error.message || "Erro inesperado!")
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className = "bg-black relative flex flex-col items-center justify-center w-full h-screen overflow-hidden font-sans">
            <InteractiveGridPattern 
            squares = {[80, 80]}
            squaresClassName = "hover:fill-purple-500/70 transition-colors duration-200"
            className={cn(
                "[mask-image:radial-gradient(90%_80%_at_60%_40%,white,transparent)]",
                "absolute inset-x-0 inset-y-[-30%] h-[150%] w-full skew-y-12 opacity-40"
        )}
        />  
            <main className = "relative z-10 w-full max-w-md p-6 flex flex-col gap-6 overflow-y-auto no-scrollbar">
                <header>
                    <h1 className="text-2xl font-bold tracking-tighter bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                        VeriFact <span className="text-purple-500 text-sm font-mono italic">2026.</span>
                    </h1>
                </header>

                {!result && !loading && (
                    <ActionCard 
                        detectedText={textToVerify}
                        onAnalyze={handleClaim}
                        onClear={() => setTextToVerify("")}
                        loading={loading}
                    />
                )}

                {loading && (
                    <div className = "animate-pulse space-y-4">
                        <div className = "h-40 bg-white/5 rounded-2xl border-white/10"></div>
                    </div>
                )}

                {result && !loading && (
                    <div className = "space-y-4 animate-in face-in slide-in-from-top-4 duration-500">
                        <VerifactCard data = {result} />
                        <button onClick = {() => {setResult(null); setTextToVerify("");}}
                                className = "w-full py-2 text-[10px] uppercase font-bold text-white/30 hover:text-white/60 transition-colors">
                            Nova Análise
                        </button>
                     </div>
                 )}

                {error && (
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                        <p>{error}</p>
                        <button onClick={() => handleClaim(textToVerify)} className="mt-2 underline">tentar novamente</button>
                    </div>
                )}
            </main> 
        </div>
    )
}