chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["API_key"],(result) => {
        if(!result.API_key){
            chrome.tabs.create({
                url: "options.html"
            });
        }
    });
});