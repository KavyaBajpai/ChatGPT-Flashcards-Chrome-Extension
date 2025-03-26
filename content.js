function extractAnswers() {
    const answerNodes = document.querySelectorAll('.markdown.prose.w-full.break-words');

    const extractedText = Array.from(answerNodes).map(node =>
        Array.from(node.children)
            .filter(child => !child.classList.contains("overflow-hidden"))
            .map(child => child.innerText.trim())
            .filter(text => text.length > 0)
            .join("\n")
    );

    return extractedText;
}

function openFlashcardsTab() {
    chrome.runtime.sendMessage({ action: "openFlashcards" });
}

function saveAndOpenFlashcards() {
    const flashcards = extractAnswers();
    console.log("Extracted flashcards:", flashcards);

    if (flashcards.length === 0) {
        alert("No flashcards found!");
        return;
    }

    // Store flashcards in chrome.storage.sync and then open the flashcards page
    chrome.runtime.sendMessage({ action: "saveFlashcards", flashcards }, () => {
        console.log("Flashcards saved, opening new tab...");
        openFlashcardsTab();
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
