"use client"

import '@/src/style.css'
import { RetroGrid } from './components/ui/retro-grid'
import { RainbowButton } from './components/ui/rainbow-button'

function sidePanel(){
    return (
        <div className = "bg-background relative flex-cox items-center w-full h-screen overflow-hidden bg-black">
            <span className="pointer-events-none z-10 bg-linear-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-center justify-center text-5xl leading-none font-bold tracking-tighter whitespace-pre-wrap text-white">
                VeriFact
            </span>
            <div className = "mt-10 w-[300px] h-[200px] justify-center">
                <RainbowButton variant = "outline">Verificar fato </RainbowButton>
            </div>
            <RetroGrid opacity={0.2} cellSize={80}/>
        </div>
    )
}

export default sidePanel