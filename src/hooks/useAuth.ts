import { sendToBackground } from "@plasmohq/messaging";
import { ChartNoAxesCombined } from "lucide-react";
import { useState, useEffect } from "react";

type AuthUser = {
    isLoggedIn: boolean,
    user: {id: string; email: string} | null,
    isLoading: boolean
}


export function useAuth(): AuthUser{
    const [state, setState] = useState<AuthUser>({
        isLoggedIn: false,
        user: null,
        isLoading: true
    })

    useEffect(() => {
        sendToBackground({ name: "check-auth"}).then((res) => {
            setState({
                isLoggedIn: res.login,
                user: res.user,
                isLoading: false,
            })
        })

    const listener = (message: any) => {
        if (message.type === "AUTH_CHANGED") {
            setState({
                isLoggedIn: message.isLoggedIn,
                user: message.user || null,
                isLoading: false
            })
        }
    }

    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
    }, [])


    // return 

    return state    
}
