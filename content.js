function extractFlashcards() {
    const messages = document.querySelectorAll('[data-testid="conversation-turn"]');

    let flashcards = [];
    let lastQuestion = null;

    messages.forEach((message) => {
        const userMessage = message.querySelector('.whitespace-pre-wrap'); // User's question
        const gptMessage = message.querySelector('.markdown.prose.w-full.break-words'); // ChatGPT's answer

        if (userMessage) {
            lastQuestion = userMessage.innerText.trim();
        }

        if (gptMessage && lastQuestion) {
            const answer = gptMessage.innerText.trim();
            flashcards.push({ question: lastQuestion, answer });
            lastQuestion = null; // Reset after pairing
        }
    });

    return flashcards;
}

function saveAndOpenFlashcards() {
    const flashcards = extractFlashcards();
    console.log("Extracted flashcards:", flashcards);

    if (flashcards.length === 0) {
        alert("No flashcards found!");
        return;
    }

    chrome.runtime.sendMessage({ action: "saveFlashcards", flashcards }, () => {
        console.log("Flashcards saved, opening new tab...");
        chrome.runtime.sendMessage({ action: "openFlashcards" });
    });
}


// Create and insert floating button
function addFlashcardButton() {
    if (document.getElementById("flashcard-btn")) return; // Prevent duplicates

    const button = document.createElement("button");
    button.id = "flashcard-btn";
    button.innerText = "Generate Flashcards";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.background = "#007bff";
    button.style.color = "white";
    button.style.padding = "10px";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";
    button.onclick = saveAndOpenFlashcards;

    document.body.appendChild(button);
}

// Wait for ChatGPT to fully load before injecting button
window.onload = addFlashcardButton;
