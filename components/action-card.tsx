import { useState } from "react";
import { Sparkles, Send } from "lucide-react";

export const ActionCard = ({ detectedText, onAnalyze, onClear, loading }) => {
    const [manualText, setManualText] = useState("");

    if (detectedText) {
        return (
            <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-sm space-y-4 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-2 text-purple-400">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase">Post Detectado</span>
                </div>
                <p className="text-sm text-gray-300 italic line-clamp-3 pl-2 border-l border-purple-500/40">
                    "{detectedText}"
                </p>
                <div className="flex gap-2">
                    <button 
                        onClick={() => onAnalyze(detectedText)}
                        className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold transition-all"
                    >
                        Analisar Agora
                    </button>
                    <button 
                        onClick={onClear}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-[10px] transition-all"
                    >
                        Limpar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <textarea 
                className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all resize-none"
                placeholder="Digite um texto para checagem..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
            />
            <button 
                onClick={() => onAnalyze(manualText)}
                disabled={!manualText.trim() || loading}
                className="w-full py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
            >
                <Send className="w-3 h-3" />
                Verificar
            </button>
        </div>
    );
};