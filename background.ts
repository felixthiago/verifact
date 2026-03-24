chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "CHECK_FACT"){
        // get request 
    }
})