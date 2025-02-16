const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// List of offensive words or phrases
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay",
    "nigger", "nigga", "koshi", "n1gg3r", "n1gger", "n1gga", "n1ger", "niger", "useless farmer",
];

const responses = {
    "hello": ["Hi!", "Hello there!", "Hey, How's it going?"],
    "how are you": ["I'm feeling good! How about you?", "Feeling chatty!"],
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

    // Check if the input is a math expression
    if (isMathExpression(input)) {
        return evaluateMathExpression(input);
    }

    // Avoid searching Wikipedia for very short or vague inputs
    if (input.length > 3) {
        return getWikipediaData(input);
    }

    return "Sorry, I couldn't understand that. Try rephrasing it.";
}

function containsOffensiveLanguage(input) {
    for (let word of offensiveWords) {
        if (input.includes(word)) {
            return true;
        }
    }
    return false;
}

function isMathExpression(input) {
    // Regex to detect basic math expressions like 3+2, 5*3, etc.
    return /^[0-9+\-*/().\s]+$/.test(input);
}

function evaluateMathExpression(expression) {
    try {
        // Evaluate the expression using JavaScript's eval function
        const result = eval(expression);
        return `The result is: ${result}`;
    } catch (error) {
        return "Sorry, I couldn't calculate that. Try rephrasing it.";
    }
}

function getWikipediaData(topic) {
    addMessage("Searching the internet...", "bot");

    const corsProxy = "https://api.allorigins.win/get?url=";
    const wikipediaAPIUrl = "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&titles=" + encodeURIComponent(topic);

    fetch(corsProxy + encodeURIComponent(wikipediaAPIUrl))
        .then(response => response.json())
        .then(data => {
            const pages = JSON.parse(data.contents).query.pages;
            const pageId = Object.keys(pages)[0];
            const extract = pages[pageId].extract;

            if (extract) {
                // Clean up the HTML tags
                const cleanText = extract.replace(/<[^>]*>/g, '').trim();
                addMessage(cleanText, "bot");
            } else {
                addMessage("Sorry, I couldn't find any data about that. Try rephrasing it.", "bot");
            }
        })
        .catch(error => {
            addMessage("Error fetching Wikipedia data: " + error.message, "bot");
        });
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
