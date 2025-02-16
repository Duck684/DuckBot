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
    if (response) {
        setTimeout(() => addMessage(capitalizeWords(response), "bot"), 500);
    }

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

    // Handle math calculations, even with "What is"
    let mathExpression = extractMathExpression(input);
    if (mathExpression) {
        try {
            return eval(mathExpression).toString();
        } catch (error) {
            return "Sorry, I couldn't process that math. Try rephrasing it.";
        }
    }

    // Ask the user to provide an answer instead of searching the internet
    askUserForResponse(input);
    return "";
}

function containsOffensiveLanguage(input) {
    return offensiveWords.some(word => input.includes(word));
}

// Extracts a math expression from a phrase like "What is 3*2"
function extractMathExpression(input) {
    let match = input.match(/(?:what is|calculate|solve|evaluate)?\s*([\d+\-*/().\s]+)/i);
    return match ? match[1].trim() : null;
}

function askUserForResponse(input) {
    let userResponse = prompt(`I don't know how to respond to "${input}". Please provide a response:`);

    if (userResponse) {
        storedResponses[input] = userResponse;
        localStorage.setItem("chatbotResponses", JSON.stringify(storedResponses));
        addMessage(userResponse, "bot");
    } else {
        addMessage("Okay, I'll try to learn next time!", "bot");
    }
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
