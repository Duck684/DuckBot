const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// List of offensive words or phrases
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay",
    "nigger", "nigga", "koshi", "n1gg3r", "n1gger", "n1gga", "n1ger", "niger", "useless farmer",
];

const responses = {
    "hello": ["Hi!", "Hello there!", "Hey, How's it going?"],
    "how are you": ["I'm good, How about you?", "Feeling chatty! How about you?"],
    "what can you do": ["I can chat with you, tell jokes, and search for information!"],
    "bye": ["Goodbye!", "See you later!", "Take care!"],
    "thanks": ["You're welcome!", "No problem!", "Anytime!"],
    "tell me a joke": ["Why don't robots get tired? Because they recharge!", 
                       "Why did the AI break up? It lost its connection!", 
                       "I told my computer a joke... now it won’t stop laughing in binary!"],
    "chatgpt": "ChatGPT is a conversational AI developed by OpenAI, designed to assist with answering questions, providing information, and generating text in a human-like manner.",
    "python": "Python is a high-level programming language known for its easy-to-read syntax and versatility. It's widely used in web development, data analysis, machine learning, and more.",
};

// Load stored responses from localStorage
const storedResponses = JSON.parse(localStorage.getItem("chatbotResponses")) || {};

function sendMessage() {
    let message = userInput.value.trim().toLowerCase();
    if (message === "") return;

    // Check for offensive language
    if (containsOffensiveLanguage(message)) {
        addMessage("Please refrain from using inappropriate language.", "bot");
        userInput.value = "";
        return;
    }

    addMessage(capitalizeWords(message), "user");

    let response = getResponse(message);
    setTimeout(() => addMessage(capitalizeWords(response), "bot"), 500);

    userInput.value = "";
}

function addMessage(text, sender) {
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("chat-message", sender);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getResponse(input) {
    // Check for a known response in the predefined responses
    if (responses[input]) {
        return responses[input][Math.floor(Math.random() * responses[input].length)];
    }

    // Check for custom responses
    if (storedResponses[input]) {
        return storedResponses[input]; // Use learned responses
    }

    // Handle basic math operations
    if (input.match(/^[0-9+\-*/().\s]*$/)) {
        try {
            return eval(input).toString();
        } catch (error) {
            return "Sorry, I couldn't process that math. Try rephrasing it.";
        }
    }

    // If the bot doesn't know the answer, ask the user to provide an answer
    if (!storedResponses[input]) {
        showModal(input);
    }

    return ""; // No predefined answer
}

function showModal(query) {
    // Display the modal pop-up to ask the user for an answer
    const modal = document.getElementById("response-modal");
    const modalContent = document.getElementById("modal-content");
    const inputField = document.getElementById("modal-input");
    const submitBtn = document.getElementById("submit-answer");

    modal.style.display = "block";
    modalContent.textContent = `I don't know the answer to "${query}". Please provide an answer.`;

    submitBtn.onclick = function() {
        const userAnswer = inputField.value.trim();
        if (userAnswer) {
            // Save the user's answer and close the modal
            storedResponses[query] = userAnswer;
            localStorage.setItem("chatbotResponses", JSON.stringify(storedResponses)); // Save to localStorage
            addMessage(`Thanks! Now I know how to respond: "${userAnswer}"`, "bot");
            modal.style.display = "none";
        } else {
            alert("Please provide an answer!");
        }
    };
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById("response-modal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function containsOffensiveLanguage(input) {
    for (let word of offensiveWords) {
        if (input.includes(word)) {
            return true;
        }
    }
    return false;
}

// Capitalize every word in a string
function capitalizeWords(str) {
    return str.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

userInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
