document.addEventListener("DOMContentLoaded", () => {
    console.log("Flashcards page loaded!");

    chrome.storage.local.get("flashcards", (data) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving flashcards:", chrome.runtime.lastError);
            return;
        }

        const flashcards = data.flashcards || [];
        console.log("Loaded flashcards:", flashcards);

        const container = document.getElementById("flashcards-container");

        if (flashcards.length === 0) {
            container.innerHTML = "<p>No flashcards available.</p>";
            return;
        }

        flashcards.forEach(({question, answer}, index) => {
            const card = document.createElement("div");
            card.className = "flashcard";
            const previewText = document.createElement("p");
            previewText.innerHTML = `<strong>Q${index + 1}:</strong> ${question}`;
            //open-button
            const openBtn = document.createElement("button");
            openBtn.innerText = "🔍 Open";
            openBtn.className = "flashcard-btn open";
            openBtn.onclick = () => openFlashcard(question, answer);
            //delete-button
            const delButton = document.createElement("button");
            delButton.className = "flashcard-btn delete-button";
            delButton.innerHTML = "Remove";
            delButton.onclick = () => deleteCard(index);

            //copy-button
            const copyButton = document.createElement("button");
            copyButton.className = "flashcard-btn copy-button";
            copyButton.innerHTML = "Copy";
            copyButton.onclick = () => copyCard(index);

            //imp-button
            const impButton = document.createElement("button");
            impButton.className = "flashcard-btn imp-button";
            impButton.innerHTML = "Mark as important";
            impButton.onclick = () => impCard(index);
            impButton.onclick = function () {
                impCard(this.parentElement); // Pass the parent flashcard div
            };

            card.appendChild(previewText);
            card.appendChild(openBtn);
            card.appendChild(delButton);
            card.appendChild(copyButton);
            card.appendChild(impButton);
            container.appendChild(card);
        });

        // function openFlashcard({question, answer}) {
        //     const modal = document.getElementById("flashcard-modal");
        //     const modalText = document.getElementById("modal-text");
        //     const closeBtn = document.querySelector(".flashcard-btn.close");
        
        //     modalText.innerHTML = `<strong>${question}</strong><br><br>${answer.replace(/\n/g, "<br>")}`;
        //     modal.style.display = "flex";
        //     document.body.classList.add("blurred"); // Blur background

        //     if (closeBtn) {
        //         console.log("Attaching event listener to close button.");
        //         closeBtn.addEventListener("click", closeFlashcard);
        //     } else {
        //         console.error("Close button not found!");
        //     }
        // }

        function openFlashcard(question, answer) {
            console.log("Opening flashcard with:", question, answer);
        
            setTimeout(() => {
                const modal = document.getElementById("flashcard-modal");
                const modalText = document.getElementById("modal-text");
                const closeBtn = document.querySelector(".flashcard-btn.close");
        
                if (modal && modalText) {
                    console.log("Modal detected, adding text...");
                    modalText.innerHTML = `<strong>${question}</strong><br><br>${answer.replace(/\n/g, "<br>")}`;
                    modal.style.display = "flex"; // Ensure modal is visible
                    document.body.classList.add("blurred"); // Blur background
                    if (closeBtn) {
                        console.log("Attaching event listener to close button.");
                        closeBtn.addEventListener("click", closeFlashcard);
                    } else {
                        console.error("Close button not found!");
                    }
                    
                }
                else
                {
                    console.error("Modal or modal-text not found!"); // Debugging log
            return;
                }
            },200);
        }
            
        
        
        function closeFlashcard() {
            console.log("closeFlashcard() function executed!");
        
            const modal = document.getElementById("flashcard-modal");
            if (modal) {
                modal.style.display = "none"; // ✅ Hide the modal
                document.body.classList.remove("blurred"); // ✅ Remove blur effect
                console.log("Modal successfully closed.");
            } else {
                console.error("Modal not found!");
            }
        }
        


        // ✅ Function to Delete a Flashcard
        function deleteCard(index) {
            chrome.storage.local.get("flashcards", (data) => {
                let flashcards = data.flashcards || [];
                flashcards.splice(index, 1); // Remove selected flashcard

                chrome.storage.local.set({ flashcards }, () => {
                    console.log(`Flashcard ${index + 1} deleted.`);
                    location.reload(); // Refresh the page to update UI
                });
            });
        }

        // ✅ Function to Copy Text to Clipboard
        function copyCard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert("Flashcard copied to clipboard!");
            });
        }

        // ✅ Function to Edit a Flashcard
        // function editFlashcard(index, oldText) {
        //     let newText = prompt("Edit your flashcard:", oldText);
        //     if (!newText) return; // If canceled, do nothing

        //     chrome.storage.local.get("flashcards", (data) => {
        //         let flashcards = data.flashcards || [];
        //         flashcards[index] = newText; // Update text

        //         chrome.storage.local.set({ flashcards }, () => {
        //             console.log(`Flashcard ${index + 1} updated.`);
        //             location.reload(); // Refresh UI
        //         });
        //     });
        // }

        // ✅ Function to Mark a Flashcard as Important
        // function impCard(card) {
        //     if(card.classList.contains("important")){
        //         card.classList.remove("important"); 
        //     } else
        //     card.classList.add("important");
        // }

        function impCard(card) {
            if (!card) return;
            card.classList.toggle("important");
        }


        console.log("Flashcards rendered successfully!");
    });
});
