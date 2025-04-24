chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "download") {
        chrome.downloads.download(
            {
                url: message.url,
                filename: message.filename,
                saveAs: message.saveAs || false
            },
            (downloadId) => {
                if (chrome.runtime.lastError) {
                    console.error("Download failed:", chrome.runtime.lastError.message);
                    sendResponse({ success: false, error: chrome.runtime.lastError.message });
                } else {
                    console.log("Download started with ID:", downloadId);
                    sendResponse({ success: true });
                }
            }
        );
        return true;
    }
});