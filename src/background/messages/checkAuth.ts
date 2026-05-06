import type { PlasmoMessaging } from "@plasmohq/messaging";

const TIME = 5 * 60 * 1000;
const API_KEY = ''


export const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const data = await chrome.storage.local.get([
        "authToken",
        "authUser",
        "authCheckedAt"
    ])

    const validCache = data.authToken && data.authCheckedAt && Date.now() - data.authCheckedAt < TIME

    if(validCache) { 
        return res.send({login: true, user: data.authUser})
    }
    try {
        const res = await fetch(API_KEY);
        // 
    } catch (err) {
        // 
    }
}