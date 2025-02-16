const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// List of offensive words or phrases
const offensiveWords = [
    "fuck", "bitch", "stupid", "idiot", "gay",
    "nigger", "nigga", "koshi", "n1gg3r", "n1gger", "n1gga", "n1ger", "niger", "useless farmer",
];

const responses = {
    "hello": ["Hi!", "Hello there!", "Hey, How's it going?"],
    "what can you do?": ["I Can Chat, Answer Questions, Calculate, Search In Wikipedia, Tell You Fun Facts & Tell You a Joke."],
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

async function sendMessage() {
    let message = userInput.value.trim().toLowerCase();
    if (message === "") return;

    // Check for offensive language
    if (containsOffensiveLanguage(message)) {
        addMessage("Please refrain from using inappropriate language.", "bot");
        userInput.value = "";
        return;
    }

    addMessage(capitalizeWords(message), "user");

    let response = await getResponse(message);
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

async function getResponse(input) {
    // Check for a known response in the predefined responses
    if (responses[input]) {
        return responses[input][Math.floor(Math.random() * responses[input].length)];
    }

    // Check for custom responses
    if (storedResponses[input]) {
        return storedResponses[input]; // Use learned responses
    }

    // Handle basic math operations directly
    if (/^\s*[-+]?\d+(\.\d+)?([\s]*[-+*/][\s]*[-+]?\d+(\.\d+)?)*\s*$/.test(input)) {
        try {
            return eval(input).toString();
        } catch (error) {
            return "Sorry, I couldn't process that math. Try rephrasing it.";
        }
    }

    // Only search if the input length is large and doesn't match common responses
    if (input.length > 3) {
        addMessage("Searching The Internet...", "bot");
        const searchResult = await getInternetData(input);
        if (searchResult) {
            return searchResult;
        }
        return "Sorry, I couldn't find any relevant information.";
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

async function getInternetData(topic) {
    const wikipediaAPIUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

    try {
        const response = await fetch(wikipediaAPIUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        if (data.extract) {
            return data.extract;
        } else {
            return "Sorry, no relevant data found.";
        }
    } catch (error) {
        return "Couldn't Find Any Data, Try Rephrasing It (Example : What Is a Duck? ---> Duck)";
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
