chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveFlashcards") {
        chrome.storage.local.set({ flashcards: request.flashcards }, () => {
            if (chrome.runtime.lastError) {
                console.error("Storage error:", chrome.runtime.lastError);
                alert("Error saving flashcards: " + chrome.runtime.lastError.message);
            } else {
                console.log("Flashcards stored successfully in local storage!");
                sendResponse({ status: "success" });
            }
        });
        return true; // Required for async sendResponse
    }

    if (request.action === "openFlashcards") {
        chrome.tabs.create({ url: chrome.runtime.getURL("flashcards.html") });
    }
});
