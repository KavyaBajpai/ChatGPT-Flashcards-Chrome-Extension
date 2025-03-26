chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "saveFlashcards") {
        chrome.storage.local.set({ flashcards: request.flashcards }, () => {
            console.log("Flashcards stored successfully!");
            sendResponse({ status: "success" });
        });
        return true;
    }

    if (request.action === "openFlashcards") {
        chrome.tabs.create({ url: chrome.runtime.getURL("flashcards.html") });
    }
});
