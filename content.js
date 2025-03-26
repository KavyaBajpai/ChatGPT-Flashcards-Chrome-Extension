function extractFlashcards() {
    const userMessages = document.querySelectorAll('.whitespace-pre-wrap'); // User's questions
    const gptMessages = document.querySelectorAll('.markdown.prose.w-full.break-words'); // ChatGPT's answers

    let flashcards = [];
    
    userMessages.forEach((userMessage, index) => {
        const question = userMessage.innerText.trim();
        const answer = gptMessages[index] ? gptMessages[index].innerText.trim() : ""; // Match answer with question
        
        if (question && answer) {
            flashcards.push({ question, answer });
        }
    });

    console.log("Extracted flashcards:", flashcards);
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
